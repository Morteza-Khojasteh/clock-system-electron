const { BrowserWindow } = require("electron");
const path = require("path");

function createSetupWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 500,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/setup-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "../ui/setup.html"));

  return win;
}

module.exports = { createSetupWindow };
