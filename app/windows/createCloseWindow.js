const { BrowserWindow, screen } = require("electron");
const path = require("path");

function createCloseWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    x: width - 80,
    y: 20,
    width: 60,
    height: 60,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
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
    win.show();
  });

  return win;
}

module.exports = { createCloseWindow };
