const { BrowserWindow, screen } = require("electron");
const path = require("path");

function createCloseWindow() {
  const win = new BrowserWindow({
    width: 60,
    height: 60,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/overlay-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile(path.join(__dirname, "../ui/close.html"));

  win.once("ready-to-show", () => {
    const { width } = screen.getPrimaryDisplay().workAreaSize;
    win.setPosition(width - 80, 20);
  });

  return win;
}

module.exports = { createCloseWindow };
