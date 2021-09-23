const path = require('path');
const url = require('url');
const { app, BrowserWindow, globalShortcut } = require('electron');
const open = require('open');
const { checkForUpdates } = require('./updater');
const Sentry = require('@sentry/electron');

app.commandLine.appendSwitch('disable-http-cache');

/** @type {BrowserWindow} */
let mainWindow;

let isDev = false;

if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
  isDev = true;
}

require('@electron/remote/main').initialize();

if (!isDev) {
  if (require('electron-squirrel-startup')) {
    app.quit();
    process.exit(0);
  }

  app.whenReady().then(() => {
    globalShortcut.register('CommandOrControl+R', () => {
      console.log('CommandOrControl+R is pressed: Shortcut Disabled');
    });
    globalShortcut.register('F5', () => {
      console.log('F5 is pressed: Shortcut Disabled');
    });
  });

  //! Uncomment to prevent program running after install
  // if (process.platform === 'win32') {
  //   var cmd = process.argv[1];
  //   if (cmd === '--squirrel-firstrun') {
  //     app.quit();
  //     process.exit(0);
  //   }
  // }

  Sentry.init({
    dsn: 'https://ac6e425a093744a0a72e061986c2f138@o252778.ingest.sentry.io/5431856',
    environment: process.env.NODE_ENV,
    enableNative: true,
    debug: true,
    attachStacktrace: true,
  });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 700,
    width: 1000,
    height: 750,
    frame: false,
    darkTheme: true,
    backgroundColor: '#1b1b31',
    titleBarStyle: 'hidden',
    show: false,
    icon: `${__dirname}/assets/icon.ico`,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      preload: path.join(__dirname, 'src', 'helpers', 'Sentry', 'sentry.js'),
      devTools: true,
      worldSafeExecuteJavaScript: true,
      allowRunningInsecureContent: false,
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

  require('@electron/remote/main').enable(mainWindow.webContents);

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
