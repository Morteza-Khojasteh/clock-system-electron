const { BrowserWindow } = require("electron");
const path = require("path");
const { SERVER_URL } = require("../../config/constants");

const AUTH_KEYS = ["auth_token", "auth_staff"];
const RETRY_INTERVAL = 15_000;
const OFFLINE_PAGE = path.join(__dirname, "../../ui/offline.html");
const LOADING_PAGE = path.join(__dirname, "../../ui/loading.html");

async function clearAuthStorage(win) {
  if (!win || win.isDestroyed()) return;
  try {
    const script = AUTH_KEYS.map(
      (k) => `localStorage.removeItem(${JSON.stringify(k)})`,
    ).join(";");
    await win.webContents.executeJavaScript(script);
  } catch {
    // Page may have been unloaded — safe to ignore
  }
}

function createMainWindow(token) {
  const win = new BrowserWindow({
    icon: path.join(__dirname, "../../assets/icon.png"),
    // width: 1280,
    // height: 900,
    fullscreen: true,
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../../preload/overlay-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  let retryTimer = null;
  let serverLoaded = false;

  const serverURL = `${SERVER_URL}/${token}`;

  function loadServer() {
    win.loadURL(serverURL);
  }

  function showOffline() {
    if (retryTimer) clearInterval(retryTimer);

    win.loadFile(OFFLINE_PAGE);

    // Retry on a fixed interval until the server comes back
    retryTimer = setInterval(() => {
      if (!win.isDestroyed()) loadServer();
    }, RETRY_INTERVAL);
  }

  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(SERVER_URL) && !url.startsWith("file://")) {
      event.preventDefault();
    }
  });

  win.webContents.on(
    "did-fail-load",
    (_event, errorCode, _desc, validatedURL) => {
      if (errorCode === -3) return;
      if (validatedURL.startsWith("file://")) return;
      showOffline();
    },
  );

  // When a load succeeds, cancel any pending retry timer
  win.webContents.on("did-finish-load", () => {
    const url = win.webContents.getURL();

    // Ignore the local loader and offline pages
    if (!url.startsWith(SERVER_URL)) return;

    // Server page loaded successfully
    if (retryTimer) {
      clearInterval(retryTimer);
      retryTimer = null;
    }

    if (!serverLoaded) {
      serverLoaded = true;
      clearAuthStorage(win);
    }
  });

  // ── Boot sequence ──────────────────────────────────────────────
  // Step 1: show the local loader (instant, no network required)
  win.loadFile(LOADING_PAGE);

  // Step 2: loader painted → reveal window, start loading the server
  win.webContents.once("did-finish-load", () => {
    win.show();
    win.setKiosk(true);
    loadServer();
  });

  return win;
}

module.exports = { createMainWindow, clearAuthStorage };
