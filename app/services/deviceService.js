const { CONFIG_FILE } = require("../config/constants");
const storage = require("../storage/configStore");

function getDeviceToken() {
  const config = storage.read(CONFIG_FILE);
  return config?.deviceToken || null;
}

function saveDeviceToken(deviceToken) {
  storage.write(CONFIG_FILE, { deviceToken });
}

function resetDeviceToken() {
  storage.remove(CONFIG_FILE);
}

module.exports = { getDeviceToken, saveDeviceToken, resetDeviceToken };
