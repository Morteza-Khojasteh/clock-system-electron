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
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Startup fallback: clear stale auth data from a previous crash
  win.webContents.once("did-finish-load", () => {
    clearAuthStorage(win);
  });

  // Re-assert the close button after every navigation (login → dashboard, etc.)
  win.webContents.on("did-navigate", () => {
    onNavigate?.();
  });

  // Also covers in-page (SPA) navigations like hash/history changes
  win.webContents.on("did-navigate-in-page", () => {
    onNavigate?.();
  });

  win.loadURL(`${SERVER_URL}/${token}`);

  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(SERVER_URL)) event.preventDefault();
  });

  return win;
}

module.exports = { createMainWindow, clearAuthStorage };
