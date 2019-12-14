// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const contextMenu = require('electron-context-menu');
contextMenu({
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'Delete',
			// Only show it when right-clicking images
			click: ()=>{
        const [url,type, key] = params.linkURL.split('#')
        mainWindow.webContents.send('delete',[type,key].join(':'))
      }
		},
		{
			label: 'Search Google for “{selection}”',
			// Only show it when right-clicking text
			visible: params.selectionText.trim().length > 0,
			click: () => {
				shell.openExternal(`https://google.com/search?q=${encodeURIComponent(params.selectionText)}`);
			}
		}
	]
});
const initial = {
  selected:{
    note:'1',
    category: '1'
  },
  editor:false,
  search: '',
  notes: [
    {
      created_at: Date.now(),
      updated_at: Date.now(),
      key: '1',
      category: '1',
      title: 'A New Hope',
      description: 'A short and sweet description would not harm this note',
      content: '## Double click here to start writing'
    },
    {
      created_at: Date.now(),
      updated_at: Date.now(),
      key: '2',
      category: '2',
      title: 'Obi Wan Kenobi',
      description: 'The Force will be with you. Always',
      content: '## Double click here to start writing'
    },
    {
      created_at: Date.now(),
      updated_at: Date.now(),
      key: '3',
      category: '3',
      title: 'Yoda',
      description: 'When gone am I, the last of the Jedi will you be.',
      content: ' The Force runs strong in your family. Pass on what you have learned.'
    }
  ],
  categories: [
    {
      key: '1',
      title: 'A new hope',
      disabled: true
    },
    {
      key: '2',
      title: 'Empite Strikes Back',
      disabled: true
    },
    {
      key: '3',
      title: 'The Return of the Jedi',
      disabled: true
    }
  ]
}

require('electron-reload')(__dirname);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
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
  console.log(data)
  fs.writeFileSync(filepath, JSON.stringify(data))
})

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.webContents.once('dom-ready', () => {


  });


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
