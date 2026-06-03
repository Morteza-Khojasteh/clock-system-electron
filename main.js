const { app, ipcMain } = require("electron");

const {
  getDeviceToken,
  resetDeviceToken,
} = require("./app/services/deviceService");

const { createMainWindow } = require("./app/windows/createMainWindow");
const { createSetupWindow } = require("./app/windows/createSetupWindow");
const { createCloseWindow } = require("./app/windows/createCloseWindow");
const { registerDeviceIpc } = require("./app/ipc/deviceIpc");

let mainWindow;
let closeWindow;
let setupWindow;

function restartToSetup() {
  if (mainWindow) mainWindow.close();
  if (closeWindow) closeWindow.close();

  setupWindow = createSetupWindow();
}

app.whenReady().then(() => {
  const token = getDeviceToken();

  registerDeviceIpc({ onSetupRestart: restartToSetup });

  if (!token) {
    setupWindow = createSetupWindow();
    return;
  }

  mainWindow = createMainWindow(token);
  closeWindow = createCloseWindow();
});

ipcMain.on("close-app", () => {
  app.quit();
});

app.on("window-all-closed", () => {
  app.quit();
});
