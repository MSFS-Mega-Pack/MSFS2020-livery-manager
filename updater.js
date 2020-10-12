// const { ipcMain } = require('electron');
const electron = require('electron');
const fs = require('fs');
const { default: fetch } = require('node-fetch');
const open = require('open');
const Path = require('path');
const request = require('request');
// const reqProgress = require('request-progress');

// The current version of your app.
const APP_VERSION = require('./package.json').version;
const APP_NAME = require('./package.json').name;
const UPDATE_URL = `https://api.liveriesmegapack.com/v1/get/update`;

async function checkForUpdates(window) {
  let json;

  try {
    json = await (await fetch(`${UPDATE_URL}/${APP_VERSION}`)).json();
  } catch {
    // broken api??
    return;
  }

  if (json.data.update) {
    // Update is available!
    window.loadURL(`file://${__dirname}/update-available.html?newVersion=${json.data.info.latest || ''}&currentVersion=${APP_VERSION || ''}`);

    const updateDir = Path.join(electron.app.getPath('temp'), APP_NAME, `/updates`);
    const exePath = Path.join(updateDir, `/setup_${json.data.info.latest}.exe`);

    if (fs.existsSync(exePath)) {
      await fs.promises.unlink(exePath);
    }

    if (!fs.existsSync(updateDir)) {
      await fs.promises.mkdir(updateDir, { recursive: true });
    }

    // let progress = null;

    // ipcMain.on('get-progress', e => {
    //   e.reply('download-progress', progress);
    // });

    await new Promise((resolve, reject) => {
      // reqProgress(
      request(json.data.info.downloadUrl)
        // ,
        //   { throttle: 100 }
        // )
        .pipe(fs.createWriteStream(exePath))
        // .on('progress', p => {
        //   progress = p;
        // })
        .on('error', async err => {
          console.log(`Error`);
          console.error(err);
          reject(err);
        })
        .on('finish', async () => {
          open(exePath);
          resolve();
        });
    });
  }
}

module.exports = {
  checkForUpdates,
};
