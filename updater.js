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
  } catch (error) {
    console.log(error);
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
    let received_bytes = 0;
    let total_bytes = 0;

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
        .on('response', function (data) {
          total_bytes = parseInt(data.headers['content-length']);
        })
        .on('data', function (chunk) {
          received_bytes += chunk.length;
          showDownloadingProgress(received_bytes, total_bytes, window);
        })
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

function showDownloadingProgress(received, total, window) {
  let percentage = ((received * 100) / total).toFixed(2);
  window.webContents.send('updateData', {
    msg: `${percentage} % | ${(received / 1048576).toFixed(2)} MB downloaded out of ${(total / 1048576).toFixed(2)} MB.`,
  });
}

module.exports = {
  checkForUpdates,
};
