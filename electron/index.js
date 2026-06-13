const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const port = process.env.PORT || 5001

function createWindow() {
    const win = new BrowserWindow({
        width: 800, 
        height: 600, 
        frame: false,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadURL(`http://localhost:${port}`)
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    app.quit()
})

ipcMain.on('minimize-window', () => {
    BrowserWindow.getFocusedWindow().minimize()
})

ipcMain.on('close-window', () => {
    app.quit()
})