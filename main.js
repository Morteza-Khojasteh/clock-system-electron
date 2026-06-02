const { app, BrowserWindow, ipcMain, screen } = require("electron");

const path = require("path");

let mainWindow;
let closeWindow;
let retryTimer;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, "icon.ico"),
    width: 1280,
    height: 900,

    // Enable kiosk mode
    kiosk: true,

    autoHideMenuBar: true,

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load your React app
  mainWindow.loadURL("http://localhost:5173/clockapp");

  // Prevent opening new windows/tabs
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: "deny" };
  });

  // Prevent navigation away from the app
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("http://localhost:5173/clockapp")) {
      event.preventDefault();
    }
  });

  // Fallback page if React app/server is unavailable
  mainWindow.webContents.on("did-fail-load", () => {
    mainWindow.loadFile(path.join(__dirname, "offline.html"));

    clearTimeout(retryTimer);

    retryTimer = setTimeout(() => {
      mainWindow.loadURL("http://localhost:5173/clockapp");
    }, 10000);
  });

  // Uncomment for debugging
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    if (closeWindow && !closeWindow.isDestroyed()) {
      closeWindow.destroy();
    }

    app.quit();
  });
}

function createCloseWindow() {
  closeWindow = new BrowserWindow({
    width: 60,
    height: 60,

    frame: false,
    transparent: true,

    resizable: false,
    movable: false,

    skipTaskbar: true,

    // Add these here
    alwaysOnTop: true,

    webPreferences: {
      preload: path.join(__dirname, "overlay-preload.js"),

      contextIsolation: true,
      nodeIntegration: false,

      sandbox: true,
    },
  });

  closeWindow.loadFile(path.join(__dirname, "close.html"));

  closeWindow.once("ready-to-show", () => {
    const primaryDisplay = screen.getPrimaryDisplay();

    const { width } = primaryDisplay.workAreaSize;

    closeWindow.setPosition(width - 80, 20);
    closeWindow.setAlwaysOnTop(true, "screen-saver");
  });
}

// Close app event from overlay button
ipcMain.on("close-app", () => {
  BrowserWindow.getAllWindows().forEach((window) => window.close());
});

app.whenReady().then(() => {
  createMainWindow();
  createCloseWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
