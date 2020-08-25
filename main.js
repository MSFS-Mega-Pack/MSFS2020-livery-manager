const path = require('path');
const url = require('url');
const { app, BrowserWindow, session } = require('electron');

let mainWindow;

let isDev = false;

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  isDev = true;
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
    icon: `${__dirname}/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
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

  // // Add CSP headers
  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' devtools: webpack:"],
  //     },
  //   });
  // });

  // open new window links in the default browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    open(url);
  });

  mainWindow.menuBarVisible = false;
  mainWindow.loadURL(indexPath);

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

app.on('ready', createMainWindow);

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
