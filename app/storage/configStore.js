const fs = require("fs");

function read(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function write(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function remove(filePath) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

module.exports = { read, write, remove };
