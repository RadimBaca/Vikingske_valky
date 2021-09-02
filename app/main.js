const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require('fs');

let mainWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  //mainWindow.webContents.openDevTools();

  mainWindow.loadURL(`file://${__dirname}/index.html?actual=panel_view_players`);

  // menu
  var menu = Menu.buildFromTemplate(
    [{
      label: 'Menu',
      submenu: [
        {
          label: 'Save',
          click() {
            alert('Not implemented yet');
          }
        },
        {
          label: 'Load',
          click() {
            alert('Not implemented yet');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click() {
            app.quit()
          }
        }
      ]
    }]
  );
  Menu.setApplicationMenu(menu);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});


// Priklad IPC komunikace
// ipcMain.handle('file-read', async (event, fileName) => {
//   const players = JSON.parse(fs.readFileSync(fileName).toString());
//   return players;
// })