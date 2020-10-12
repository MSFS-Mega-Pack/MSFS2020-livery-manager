import { readdirSync, existsSync, lstatSync, readFileSync } from 'fs';
import Path from 'path';

import Config from 'electron-json-config';
import ConfigKeys from '../../data/config-keys.json';
import Constants from '../../data/Constants.json';

import AsyncForEach from '../AsyncForEach';
import ThrowError from '../ThrowError';

/**
 * Get Installed Addons
 *
 * @export
 * @return {Array} PlaneObject  Array of Plane Objects that are installed with installLocation
 */
export default async function GetInstalledAddons() {
  let installedAddons = [];
  const Directory = Path.normalize(Config.get(ConfigKeys.settings.package_directory));

  if (!existsSync(Directory)) return ThrowError('E101', `Community path does not exist:\n${Directory}`);

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
