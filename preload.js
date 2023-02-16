/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 * 
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */


const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

contextBridge.exposeInMainWorld('lookups', {
  descriptions: () => ipcRenderer.invoke('request-descriptions'),
  categories: () => ipcRenderer.invoke('request-categories')
})

contextBridge.exposeInMainWorld('electronAPI', {
  newFile: () => ipcRenderer.invoke('dialog:saveFile'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (buffer) => ipcRenderer.invoke('dialog:saveFile', buffer)
})