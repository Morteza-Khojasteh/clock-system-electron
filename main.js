const { app, ipcMain } = require("electron");

const { getDeviceToken } = require("./app/services/deviceService");
const {
  createMainWindow,
  clearAuthStorage,
} = require("./app/windows/factories/createMainWindow");
const {
  createSetupWindow,
} = require("./app/windows/factories/createSetupWindow");
const { registerDeviceIpc } = require("./app/ipc/deviceIpc");

let mainWindow = null;
let setupWindow = null;

function launchApp() {
  const token = getDeviceToken();

  if (!token) {
    setupWindow = createSetupWindow();
    return;
  }

  mainWindow = createMainWindow(token);
}

function restartToSetup() {
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
  }
  setupWindow = createSetupWindow();
}

function launchAfterSetup() {
  if (setupWindow) {
    setupWindow.close();
    setupWindow = null;
  }
  mainWindow = createMainWindow(getDeviceToken());
}

app.whenReady().then(() => {
  registerDeviceIpc({
    onSetupRestart: restartToSetup,
    onSetupComplete: launchAfterSetup,
  });

  launchApp();
});

// Primary: clear auth storage before quitting
ipcMain.on("close-app", async () => {
  await clearAuthStorage(mainWindow);
  app.quit();
});

app.on("window-all-closed", () => {
  app.quit();
});
