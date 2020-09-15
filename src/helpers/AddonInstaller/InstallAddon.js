import fs from 'fs';
import admzip from 'adm-zip';
import request from 'request';
import ThrowError from '../ThrowError';
import GetPackagesDirectory from '../MSFS/Directories/GetPackagesDirectory';
import constants from '../../data/Constants.json';

/**
 * Set path to a CFG file
 *
 * @export
 * @argument {Object} PlaneObject  Pass the PlaneObject from the API
 */
export default async function installAddon(PlaneObject) {
  const Directory = 'E:\\Games\\Flight Simulator';
  console.log(PlaneObject);
  const downloadURL = `${constants.urls.cdnEndpoint}/${PlaneObject.fileName}`;
  const zipName = PlaneObject.fileName.substr(PlaneObject.fileName.lastIndexOf('/') + 1);
  const downloadDir = `${Directory}\\Community\\${zipName}`;

  request
    .get(downloadURL)
    .on('error', function (error) {
      ThrowError('E008', `${error} URL: ${downloadURL}`);
    })
    .pipe(fs.createWriteStream(downloadDir))
    .on('finish', async function () {
      console.log(`Finished downloading: ${zipName}`);
      const zip = new admzip(downloadDir);
      const extractDir = `${Directory}\\Community\\${zipName.split('.zip')[0]}`;
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
      zip.extractAllToAsync(`${extractDir}`, /*overwrite*/ true, function () {
        try {
          fs.unlinkSync(downloadDir);
          fs.writeFileSync(`${extractDir}\\do-not-touch.json`, JSON.stringify(PlaneObject, null, 2));
          console.log(`Installed: ${zipName}`);
        } catch (error) {
          console.log(error);
        }
      });
    });
}
