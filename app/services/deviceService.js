const path = require("path");
const storage = require("../storage/configStore");

const CONFIG_DIR = process.env.ProgramData + "/ClockSystem";
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

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

module.exports = {
  getDeviceToken,
  saveDeviceToken,
  resetDeviceToken,
};
