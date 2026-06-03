const { BrowserWindow } = require("electron");
const path = require("path");
const { SERVER_URL } = require("../config/constants");

function createMainWindow(token) {
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

  win.loadURL(`${SERVER_URL}/${token}`);

  win.webContents.setWindowOpenHandler(() => ({
    action: "deny",
  }));

  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(SERVER_URL)) {
      event.preventDefault();
    }
  });

  return win;
}

module.exports = { createMainWindow };
