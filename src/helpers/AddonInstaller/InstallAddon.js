import { default as fs, promises as fsPromises } from 'fs';
import Path from 'path';
import { remote } from 'electron';

import admzip from 'adm-zip';
import request from 'request';
import progress from 'request-progress';
import Config from 'electron-json-config';

import ThrowError from '../ThrowError';
import addLiveryInstallAnalytic from './addLiveryInstallAnalytic';

import Constants from '../../data/Constants.json';
import ConfigKeys from '../../data/config-keys.json';
/**
 * Download and install an addon
 *
 * @export
 * @param {object} PlaneObject  Pass the PlaneObject from the API
 * @param {number} index
 * @param {number} total
 * @param {import("../../locales/Locale").default} CurrentLocale Current locale
 * @param {"fresh"|"update"} installType Type of install (update, fresh install, etc)
 */
export default async function InstallAddon(PlaneObject, index, total, CurrentLocale, updateProgress, installType) {
  const Directory = Config.get(ConfigKeys.settings.package_directory);
  const downloadURL = `${Constants.urls.cdnEndpoint}/${PlaneObject.fileName}?hash=${PlaneObject.checkSum}`;
  const zipName = PlaneObject.fileName.substr(PlaneObject.fileName.lastIndexOf('/') + 1);
  const tempPath = Path.join(remote.app.getPath('temp'), Constants.appName, Constants.dirs.downloadCache);
  const zipPath = Path.join(tempPath, zipName);
  const extractDir = Path.join(Directory, `${zipName.split('.zip')[0]}`);
  const Sentry = require('@sentry/electron');
  const { RewriteFrames } = require('@sentry/integrations');

  Sentry.init({
    dsn: Constants.urls.sentryDSN,
    environment: process.env.NODE_ENV,
    enableNative: true,
    debug: true,
    attachStacktrace: true,
    integrations: [new RewriteFrames()],
  });

  updateProgress(
    CurrentLocale.translate('helpers.install_addon.progress_notifications.downloading_livery', {
      current: `${index + 1}`,
      total: `${total}`,
    })
  );

  console.log(zipPath);

  console.log(`mk temp path`);
  if (!fs.existsSync(tempPath)) {
    await fsPromises.mkdir(tempPath, { recursive: true });
  }
  try {
    if (fs.existsSync(extractDir)) {
      await fsPromises.rmdir(extractDir, { recursive: true });
    }
  } catch (err) {
    console.log(err);
  }

  console.log(`check zip exists`);
  if (fs.existsSync(zipPath)) {
    await fsPromises.unlink(zipPath);
  }

  await new Promise((resolve, reject) => {
    try {
      console.log(`Making stream`);
      const stream = fs.createWriteStream(zipPath);

      console.log(`Starting DL`);
      progress(request(downloadURL), { throttle: 100 })
        .pipe(stream)
        .on('error', async err => {
          console.log(`Error`);
          try {
            ThrowError('E008', `${err} URL: ${downloadURL}`);
          } catch (e) {}
          reject(err);
        })
        .on('progress', e => {
          console.log(e.percent);
        })
        .on('finish', async () => {
          console.log(`Finished downloading: ${zipName}`);
          updateProgress(
            CurrentLocale.translate('helpers.install_addon.progress_notifications.extracting_livery', {
              current: `${index + 1}`,
              total: `${total}`,
            })
          );

          const zip = new admzip(zipPath);

          console.log(`Created folder \n${extractDir}`);
          try {
            zip.extractAllToAsync(`${extractDir}`, /*overwrite*/ true, () => {
              try {
                fs.unlinkSync(zipPath);
                fs.writeFileSync(Path.join(extractDir, Constants.modLockFileName), JSON.stringify(PlaneObject, null, 2));
                console.log(`Installed: ${zipName}`);

                // Add analytic for this installed livery
                if (installType === 'fresh') {
                  try {
                    addLiveryInstallAnalytic(PlaneObject.displayName);
                  } catch (e) {}
                }

                resolve();
              } catch (err) {
                fs.unlinkSync(zipPath);
                Sentry.captureException(`LiveryInstaller: ${zipName}, error: ${err}`, {
                  tags: {
                    file: `${zipName} | ${PlaneObject.checkSum}`,
                  },
                });
                reject(`LiveryInstaller: ${zipName}, error: ${err}`);
              }
            });
          } catch (error) {
            Sentry.captureException(`LiveryInstaller: ${zipName}, error: ${error}`, {
              tags: {
                file: `${zipName} | ${PlaneObject.checkSum}`,
              },
            });
            reject(`LiveryInstaller: ${zipName}, error: ${error}`);
          }
        });
    } catch (e) {
      reject(`LiveryInstaller: ${zipName}, error: ${e}`);
    }
  });
}
