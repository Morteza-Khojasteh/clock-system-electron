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
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(SERVER_URL) && !url.startsWith("file://")) {
      event.preventDefault();
    }
  });

  win.webContents.on("did-navigate", () => onNavigate?.());
  win.webContents.on("did-navigate-in-page", () => onNavigate?.());

  // Step 1: load the local loader page
  win.loadFile(path.join(__dirname, "../ui/loading.html"));

  // Step 2: loader is painted → show window, then load the server URL
  win.webContents.once("did-finish-load", () => {
    win.show();

    // Step 3: server page finished → clear stale auth (crash fallback)
    win.webContents.once("did-finish-load", () => {
      clearAuthStorage(win);
    });

    win.loadURL(`${SERVER_URL}/${token}`);
  });

  return win;
}

module.exports = { createMainWindow, clearAuthStorage };
