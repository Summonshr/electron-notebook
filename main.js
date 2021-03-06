const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs')
const path = require('path')
const initial = require('./initial')
const contextMenu = require('electron-context-menu');
contextMenu({
  showInspectElement: false,
  showCopyImage: false,
  prepend: (defaultActions, params, browserWindow) => [
    {
      label: 'Delete',
      visible: params.linkURL.split('#').length === 3,
      click: async () => {
        const [url, type, key] = params.linkURL.split('#')
        const choice = await dialog.showMessageBox(mainWindow, {
          type: 'question',
          buttons: ['Ok', 'Cancel'],
          title: 'Delete this item?',
          message: 'It will be in recycle bin.',
          defaultId: 0,
          cancelId: 1
        })
        if (choice.response === 0) {
          mainWindow.webContents.send('delete', [type, key].join(':'))
        }
      }
    },
    {
      label: 'Add to Favourite',
      visible: params.linkURL.split('#').length === 3,
      click: async () => {
        const [url, type, key] = params.linkURL.split('#')
        mainWindow.webContents.send('favourite:add', key)
      }
    },
    {
      label: 'Add in to-do list: “{selection}”',
      visible: params.selectionText.trim().length > 0,
      click: () => {
        mainWindow.webContents.send('to-do:add', params.selectionText)
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

ipcMain.on('confirm', (e, data) => {

  const choice = dialog.showMessageBox(mainWindow, {
    type: 'question',
    buttons: ['Ok', 'Cancel'],
    title: data.title,
    message: data.message
  }).then(({ response }) => {
    e.returnValue = response
  })

})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    nodeIntegration: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.maximize()
  mainWindow.loadFile('./dist/index.html')

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
