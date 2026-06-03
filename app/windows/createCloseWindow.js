const { BrowserWindow, screen } = require("electron");
const path = require("path");

function createCloseWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    x: width - 80,
    y: 20,
    width: 65,
    height: 65,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    // "screen-saver" is the highest alwaysOnTop level on Windows —
    // it sits above kiosk/fullscreen windows reliably.
    alwaysOnTop: true,
    visibleOnAllWorkspaces: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/overlay-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile(path.join(__dirname, "../ui/close.html"));

  win.once("ready-to-show", () => {
    // Set the highest z-order level before showing
    win.setAlwaysOnTop(true, "screen-saver");
    win.show();
  });

  return win;
}

/**
 * Re-asserts the close button's z-order and position.
 * Call this after every main-window navigation event.
 */
function reassertCloseWindow(win) {
  if (!win || win.isDestroyed()) return;
  const { width } = screen.getPrimaryDisplay().workAreaSize;
  win.setAlwaysOnTop(true, "screen-saver");
  win.setPosition(width - 80, 20);
  if (!win.isVisible()) win.show();
}

module.exports = { createCloseWindow, reassertCloseWindow };
