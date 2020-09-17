import fs from 'fs';
import Path from 'path';

import admzip from 'adm-zip';
import request from 'request';
import Config from 'electron-json-config';

import ThrowError from '../ThrowError';

import Constants from '../../data/Constants.json';
import ConfigKeys from '../../data/config-keys.json';

/**
 * Download and install an addon
 *
 * @export
 * @argument {Object} PlaneObject  Pass the PlaneObject from the API
 */
export default async function InstallAddon(PlaneObject) {
  const Directory = Config.get(ConfigKeys.settings.package_directory);
  const downloadURL = `${Constants.urls.cdnEndpoint}/${PlaneObject.fileName}`;
  const zipName = PlaneObject.fileName.substr(PlaneObject.fileName.lastIndexOf('/') + 1);
  const downloadDir = Path.join(Directory, `Community\\${zipName}`);

  request
    .get(downloadURL)
    .on('error', function (error) {
      ThrowError('E008', `${error} URL: ${downloadURL}`);
    })
    .pipe(fs.createWriteStream(downloadDir))
    .on('finish', async function () {
      console.log(`Finished downloading: ${zipName}`);
      const zip = new admzip(downloadDir);
      const extractDir = Path.join(Directory, `Community\\${zipName.split('.zip')[0]}`);
      fs.mkdir(
        extractDir,
        err =>
          async function () {
            if (err) {
              fs.unlinkSync(downloadDir);
              return console.error(err);
            }
          }
      );
      console.log(`Created folder \n${extractDir}`);
      zip.extractAllToAsync(`${extractDir}`, /*overwrite*/ true, async function () {
        try {
          fs.unlinkSync(downloadDir);
          fs.writeFileSync(Path.join(extractDir, `do-not-touch.json`), JSON.stringify(PlaneObject, null, 2));
          console.log(`Installed: ${zipName}`);
        } catch (error) {
          console.log(error);
          fs.unlinkSync(downloadDir);
        }
      });
    });
}
