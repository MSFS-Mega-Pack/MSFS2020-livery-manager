const electron = require('electron');

// The current version of your app.
const APP_VERSION = require('./package.json').version;

// The url that the application is going to query for new release
const AUTO_UPDATE_URL =
  'https://api.update.rocks/update/github.com/MSFS-Mega-Pack/MSFS2020-livery-manager/stable/' + process.platform + '/' + APP_VERSION;

function checkForUpdates(window) {
  if (process.platform === 'linux') {
    /* There is no auto update for linux however you can still
       notify the user that a new update has been released
       our service will return an answer with the latest version. */
    console.log('Auto updates not available on linux');
  } else {
    initDarwinWin32(window);
  }
}

function initDarwinWin32(window) {
  electron.autoUpdater.on('error', err => console.error(`Update error: ${err.message}`));

  electron.autoUpdater.on('checking-for-update', () => console.log('Checking for update'));

  electron.autoUpdater.on('update-available', () => {
    console.log('Update available');

    window.loadURL(`file://${__dirname}/update-available.html`);
  });

  electron.autoUpdater.on('update-not-available', () => console.log('No update available'));

  // Ask the user if he wants to update if update is available
  electron.autoUpdater.on('update-downloaded', () => {
    electron.autoUpdater.quitAndInstall();
  });

  electron.autoUpdater.setFeedURL(AUTO_UPDATE_URL);
  electron.autoUpdater.checkForUpdates();
}

module.exports = {
  checkForUpdates,
};
