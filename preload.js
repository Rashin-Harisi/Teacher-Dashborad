const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'api',
  {
    sendData : (data)=>ipcRenderer.invoke("sendData",data),
    getData : ()=>ipcRenderer.invoke("getData"),
    editData : (id)=>ipcRenderer.invoke("editData", id),
    updateData : (data) => ipcRenderer.invoke("updateData", data),
  }
)

