// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, dialog, nativeTheme} = require('electron')
const jetpack = require('fs-jetpack')
const path = require('path')

async function handleFileNew() {
  const { canceled, filePaths } = await dialog.showSaveDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

async function handleFileSave(event, buffer) {
  const { canceled, filePaths } = await dialog.showSaveDialog()
  console.log(canceled)
  console.log(filePaths)
  if (canceled) {
    return
  } else {
    console.log(filePaths)
    console.log(event)
    console.log(buffer)
    jetpack.write(filePaths, buffer)
    return filePaths
  }
}

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  ipcMain.handle('dialog:newFile', handleFileNew)
  ipcMain.handle('dialog:openFile', handleFileOpen)
  ipcMain.handle('dialog:saveFile', handleFileSave)

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })
  
  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })

  ipcMain.handle('request-descriptions', (event) => {
    const array = jetpack.read('descriptions.json', 'json')
    return array;
  })

  ipcMain.handle('request-categories', (event) => {
    const array = jetpack.read('categories.json', 'json')
    return array;
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
