const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'api',
  {
    sendData : (data)=>ipcRenderer.invoke("sendData",data),
    getData : ()=>ipcRenderer.invoke("getData"),
    editData : (data)=>ipcRenderer.invoke("editData", data),
    deleteData : (id) => ipcRenderer.invoke("deleteData", id),
  }
)

