import { readdirSync, existsSync, lstatSync, readFileSync } from 'fs';
import Path from 'path';

import Config from 'electron-json-config';
import ConfigKeys from '../../data/config-keys.json';
import Constants from '../../data/Constants.json';

import AsyncForEach from '../AsyncForEach';

/**
 * Download and install an addon
 *
 * @export
 * @return {Array} PlaneObject  Array of Plane Objects
 */
export default async function GetInstalledAddons() {
  let installedAddons = [];
  const Directory = Path.join(Config.get(ConfigKeys.settings.package_directory), 'Community');

  await AsyncForEach(readdirSync(Directory), folder => {
    const jsonPath = Path.join(Directory, folder, Constants.modLockFileName);
    try {
      if (existsSync(jsonPath) && lstatSync(jsonPath).isFile()) {
        let planeJson = JSON.parse(readFileSync(jsonPath, 'utf8'));
        planeJson.installLocation = Path.join(Directory, folder);
        installedAddons.push(planeJson);
      }
    } catch (error) {
      console.log(error);
    }
  });
  return installedAddons;
}
