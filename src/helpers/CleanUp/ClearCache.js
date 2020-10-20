import { remote } from 'electron';
import Constants from '../../data/Constants.json';
import Path from 'path';
import fs from 'fs';

export default async function ClearCache() {
  try {
    const tempPath = Path.join(remote.app.getPath('temp'), Constants.appName, Constants.dirs.downloadCache);

    if (fs.existsSync(tempPath)) {
      await fs.promises.rmdir(tempPath, { recursive: true });
    }
  } catch (error) {
    const Constants = require('../../data/Constants.json');
    const Sentry = require('@sentry/electron');
    Sentry.init({
      dsn: Constants.urls.sentryDSN,
      environment: process.env.NODE_ENV,
      enableNative: true,
      debug: true,
      attachStacktrace: true,
    });
    Sentry.captureException(`${error}`, {
      tags: {
        path: tempPath,
      },
    });
    return false;
  }

  return true;
}
