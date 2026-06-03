const { BrowserWindow } = require("electron");
const path = require("path");
const { SERVER_URL } = require("../config/constants");

const AUTH_KEYS = ["auth_token", "auth_staff"];

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

function createMainWindow(token, { onNavigate } = {}) {
  const win = new BrowserWindow({
    icon: path.join(__dirname, "../assets/icon.ico"),
    width: 1280,
    height: 900,
    kiosk: true,
    autoHideMenuBar: true,
    // Start hidden — shown once the loader is displayed
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 1. Show the local loader immediately — zero blank-screen time
  win.loadFile(path.join(__dirname, "../ui/loading.html"));

  win.once("ready-to-show", () => {
    win.show();

    // 2. Once the loader is painted, kick off the real server load
    win.webContents.once("did-finish-load", () => {
      win.loadURL(`${SERVER_URL}/${token}`);
    });
  });

  // 3. Startup fallback: clear stale auth data from a previous crash
  //    Fires after the server page finishes loading (the second load)
  win.webContents.on("did-finish-load", () => {
    // Only clear after the server URL has loaded, not the loader itself
    if (win.webContents.getURL().startsWith(SERVER_URL)) {
      clearAuthStorage(win);
    }
  });

  // 4. Re-assert the close button after every navigation (login → dashboard, etc.)
  win.webContents.on("did-navigate", () => {
    onNavigate?.();
  });

  // Also covers SPA navigations (hash / history changes)
  win.webContents.on("did-navigate-in-page", () => {
    onNavigate?.();
  });

  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  win.webContents.on("will-navigate", (event, url) => {
    // Allow the initial server load; block anything outside SERVER_URL
    if (!url.startsWith(SERVER_URL) && !url.startsWith("file://")) {
      event.preventDefault();
    }
  });

  return win;
}

module.exports = { createMainWindow, clearAuthStorage };
