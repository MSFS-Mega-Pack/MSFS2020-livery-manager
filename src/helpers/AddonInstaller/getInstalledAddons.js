import { readdirSync, existsSync, lstatSync, readFileSync } from 'fs';
import Path from 'path';

import ConfigKeys from '../../data/config-keys.json';
import Constants from '../../data/Constants.json';

import AsyncForEach from '../AsyncForEach';
import getConfigInstance from '../getConfigInstance';
import ThrowError from '../ThrowError';

/**
 * @typedef {{
      airplane: string,
      fileName: string,
      displayName: string,
      generation: string,
      metaGeneration: string,
      lastModified: string,
      ETag: string,
      size: string,
      checkSum: string,
      image: string,
      smallImage: string,
    }} InstalledLiveryJson
 */

/**
 * Get Installed Addons
 *
 * @export
 * @return {Promise<InstalledLiveryJson[]>} PlaneObject  Array of Plane Objects that are installed with installLocation
 */
export default async function GetInstalledAddons() {
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
  let installedAddons = [];
  const Directory = Path.normalize(getConfigInstance().get(ConfigKeys.settings.package_directory));

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
      Sentry.captureException(`${error}`, {
        tags: {
          path: jsonPath,
        },
      });
    }
  });

  return installedAddons;
}
