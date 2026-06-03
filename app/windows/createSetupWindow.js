const { BrowserWindow } = require("electron");
const path = require("path");

function createSetupWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../assets/icon.ico"),
    webPreferences: {
      preload: path.join(__dirname, "../preload/setup-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile(path.join(__dirname, "../ui/setup.html"));

  return win;
}

module.exports = { createSetupWindow };
