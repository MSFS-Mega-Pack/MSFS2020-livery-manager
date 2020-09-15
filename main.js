const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');
const open = require('open');
const { checkForUpdates } = require('./updater');

app.commandLine.appendSwitch('disable-http-cache');

/** @type {BrowserWindow} */
let mainWindow;

let isDev = false;

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  isDev = true;
}

if (!isDev) {
  if (require('electron-squirrel-startup')) {
    app.quit();
    process.exit(0);
  }

  //! Uncomment to prevent program running after install
  // if (process.platform === 'win32') {
  //   var cmd = process.argv[1];
  //   if (cmd === '--squirrel-firstrun') {
  //     app.quit();
  //     process.exit(0);
  //   }
  // }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    frame: false,
    darkTheme: true,
    titleBarStyle: 'hidden',
    resizable: false,
    show: false,
    icon: `${__dirname}/assets/icon.ico`,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      'web-security': false,
    },
  });

  let indexPath;

  if (isDev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true,
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true,
    });
  }

  // open new window links in the default browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    open(url);
  });

  mainWindow.menuBarVisible = false;
  mainWindow.loadURL(indexPath);

  if (!isDev) {
    checkForUpdates(mainWindow);
  }

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // Open devtools if dev
    if (isDev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

      installExtension(REACT_DEVELOPER_TOOLS).catch(err => console.log('Error loading React DevTools: ', err));
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
  createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Stop error
app.allowRendererProcessReuse = true;
