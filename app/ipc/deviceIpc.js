const { ipcMain } = require("electron");
const { saveDeviceToken, resetDeviceToken } = require("../services/deviceService");

function registerDeviceIpc({ onSetupRestart, onSetupComplete }) {
  ipcMain.handle("save-device-token", async (_, token) => {
    saveDeviceToken(token);
    onSetupComplete?.();
    return true;
  });

  ipcMain.on("reset-device", () => {
    resetDeviceToken();
    onSetupRestart?.();
  });
}

module.exports = { registerDeviceIpc };
