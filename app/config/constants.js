const path = require("path");

const CONFIG_DIR = path.join(process.env.ProgramData, "ClockSystem");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

const SERVER_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5173/clockapp"
    : "http://localhost:5173/clockapp";

module.exports = {
  CONFIG_DIR,
  CONFIG_FILE,
  SERVER_URL,
};
