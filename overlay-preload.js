const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronOverlay", {
  closeApp: () => ipcRenderer.send("close-app"),
});
