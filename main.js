const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const contextMenu = require('electron-context-menu');
const initial = require('./initial')
contextMenu({
  prepend: (defaultActions, params, browserWindow) => [
    {
      label: 'Delete',
      visible: console.log(params.linkURL.split('#').length) || params.linkURL.split('#').length === 3,
      click: async () => {
        const [url, type, key] = params.linkURL.split('#')
        const choice = await dialog.showMessageBox(mainWindow, {
          type: 'question',
          buttons: ['Ok', 'Cancel'],
          title: 'Delete this item?',
          message: 'It cannot be reversed.',
          defaultId: 0,
          cancelId: 1
        })
        if (choice.response === 0) {
          mainWindow.webContents.send('delete', [type, key].join(':'))
        }
      }
    },
    {
      label: 'Restore',
      visible: params.linkURL.toLowerCase().indexOf('#restore') > -1,
      click: () => {
        const [url, type, key] = params.linkURL.split('#')
        mainWindow.webContents.send('restore', [type, key].join(':'))
      }
    }
  ]
});


require('electron-reload')(__dirname);
let mainWindow
let filepath = path.join(app.getPath('documents'), 'notes.json')
ipcMain.on('get-data', e => {
  fs.access(filepath, fs.F_OK, (err) => {
    if (err) {
      e.returnValue = initial
      return
    }

    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) throw err;
      e.returnValue = JSON.parse(data)
    });

  })
})

ipcMain.on('data', (e, data) => {
  fs.writeFileSync(filepath, JSON.stringify(data))
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')

  mainWindow.webContents.on('get-data', e => {
    fs.access(filepath, fs.F_OK, (err) => {
      if (err) {
        e.returnValue = initial
        return
      }

      fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) throw err;
        e.returnValue = JSON.parse(data)
      });

    })
  })

  mainWindow.webContents.on('data', (e, data) => {
    fs.writeFileSync(filepath, JSON.stringify(data))
  })

  mainWindow.webContents.once('dom-ready', () => {


  });

  mainWindow.webContents.on('new-window', e => e.preventDefault())

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

