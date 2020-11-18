const electron = require('electron');
const app = electron.app;
const path = require('path');
const BrowserWindow = electron.BrowserWindow;
const nativeImage = electron.nativeImage;

// # Comment for production
require('dotenv').config();
// -------------------------- #

let mainWindow;

if (process.env.NODE_ENV === 'DEV') require('electron-reload');

function createWindow() {
    const iconPath = process.env.NODE_ENV === 'DEV' ? './src/assets/icons/' : `${path.dirname(app.getPath('exe')) + '/resources/app/src/assets/icons/'}`
    var image = nativeImage.createFromPath(iconPath + 'icon.png');
    image.setTemplateImage(true);
    mainWindow = new BrowserWindow({
        width: 800,
        height: 650,
        icon: image,
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
