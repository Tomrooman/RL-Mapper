const electron = require('electron');
const app = electron.app;
const path = require('path');
const BrowserWindow = electron.BrowserWindow;

// # Comment for production
require('dotenv').config();
// -------------------------- #

let mainWindow;

if (process.env.NODE_ENV === 'DEV') require('electron-reload');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 650,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(
        process.env.NODE_ENV === 'DEV' ?
            'http://localhost:8080' :
            `file://${path.dirname(app.getPath('exe')) + '/resources/app/build/index.html'}`
    );

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    require('./menu.js');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

app.on('activate', () => {
    if (mainWindow === null)
        createWindow();
});
