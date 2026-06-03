const { app, ipcMain } = require("electron");

const { getDeviceToken, resetDeviceToken } = require("./app/services/deviceService");
const { createMainWindow }  = require("./app/windows/createMainWindow");
const { createSetupWindow } = require("./app/windows/createSetupWindow");
const { createCloseWindow } = require("./app/windows/createCloseWindow");
const { registerDeviceIpc } = require("./app/ipc/deviceIpc");

let mainWindow  = null;
let closeWindow = null;
let setupWindow = null;

function launchApp() {
  const token = getDeviceToken();

  if (!token) {
    setupWindow = createSetupWindow();
    return;
  }

  mainWindow  = createMainWindow(token);
  closeWindow = createCloseWindow();
}

function restartToSetup() {
  if (mainWindow)  { mainWindow.close();  mainWindow  = null; }
  if (closeWindow) { closeWindow.close(); closeWindow = null; }
  setupWindow = createSetupWindow();
}

// Called after setup saves the token — close setup and open main app
function launchAfterSetup() {
  if (setupWindow) { setupWindow.close(); setupWindow = null; }
  mainWindow  = createMainWindow(getDeviceToken());
  closeWindow = createCloseWindow();
}

app.whenReady().then(() => {
  registerDeviceIpc({
    onSetupRestart: restartToSetup,
    onSetupComplete: launchAfterSetup,
  });

  launchApp();
});

ipcMain.on("close-app", () => {
  app.quit();
});

app.on("window-all-closed", () => {
  app.quit();
});
