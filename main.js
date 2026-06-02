const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 900,

    // Enable kiosk mode
    kiosk: true,

    webPreferences: {
      preload: `${__dirname}/preload.js`,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Handle server unavailable
  mainWindow.webContents.on("did-fail-load", () => {
    mainWindow.loadFile(path.join(__dirname, "offline.html"));
  });

  mainWindow.loadURL("http://localhost:5173/clockapp");
}

app.whenReady().then(createWindow);

ipcMain.on("close-app", () => {
  app.quit();
});
