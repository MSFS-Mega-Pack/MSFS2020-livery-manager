import fs from 'fs';
import Path from 'path';

import admzip from 'adm-zip';
import request from 'request';
import Config from 'electron-json-config';

import ThrowError from '../ThrowError';

import Constants from '../../data/Constants.json';
import ConfigKeys from '../../data/config-keys.json';

import { remote } from 'electron';
/**
 * Download and install an addon
 *
 * @export
 * @argument {Object} PlaneObject  Pass the PlaneObject from the API
 */
export default async function InstallAddon(PlaneObject) {
  const Directory = Config.get(ConfigKeys.settings.package_directory);
  const downloadURL = `${Constants.urls.cdnEndpoint}/${PlaneObject.fileName}?hash=${PlaneObject.checkSum}`;
  const zipName = PlaneObject.fileName.substr(PlaneObject.fileName.lastIndexOf('/') + 1);
  const tempPath = Path.join(remote.app.getPath('temp'), Constants.appName, Constants.dirs.downloadCache);
  const extractDir = Path.join(Directory, `Community\\${zipName.split('.zip')[0]}`);

  await new Promise((resolve, reject) => {
    request
      .get(downloadURL)
      .on('error', function (err) {
        ThrowError('E008', `${err} URL: ${downloadURL}`);
        reject(err);
      })
      .pipe(fs.createWriteStream(tempPath))
      .on('finish', async function () {
        console.log(`Finished downloading: ${zipName}`);
        const zip = new admzip(tempPath);
        fs.mkdir(
          extractDir,
          err =>
            async function () {
              if (err) {
                fs.unlinkSync(tempPath);
                reject(err);
              }
            }
        );
        console.log(`Created folder \n${extractDir}`);
        zip.extractAllToAsync(`${extractDir}`, /*overwrite*/ true, function () {
          try {
            fs.unlinkSync(tempPath);
            fs.writeFileSync(Path.join(extractDir, `do-not-touch.json`), JSON.stringify(PlaneObject, null, 2));
            console.log(`Installed: ${zipName}`);
            resolve();
          } catch (err) {
            fs.unlinkSync(tempPath);
            reject(err);
          }
        });
      });
  });
}
