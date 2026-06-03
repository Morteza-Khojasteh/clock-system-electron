const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("setupAPI", {
  saveToken: (token) => ipcRenderer.invoke("save-device-token", token),
});
