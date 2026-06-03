const { ipcMain } = require("electron");
const {
  saveDeviceToken,
  resetDeviceToken,
} = require("../services/deviceService");

function registerDeviceIpc({ onSetupRestart }) {
  ipcMain.handle("save-device-token", async (_, token) => {
    saveDeviceToken(token);
    onSetupRestart?.();
    return true;
  });

  ipcMain.on("reset-device", () => {
    resetDeviceToken();
    onSetupRestart?.();
  });
}

module.exports = { registerDeviceIpc };
