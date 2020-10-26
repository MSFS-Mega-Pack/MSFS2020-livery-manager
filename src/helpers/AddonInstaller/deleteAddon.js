import fs from 'fs';
import del from 'del';

/**
 * Remove installed addon by Path
 *
 * @export
 * @argument {string} Path, remove addon by path.
 * @return {Promise<[boolean, string]>} Removed the addon true/false
 */
export default async function DeleteAddon(path) {
  const Constants = require('../../data/Constants.json');
  const Sentry = require('@sentry/electron');
  Sentry.init({
    dsn: Constants.urls.sentryDSN,
    environment: process.env.NODE_ENV,
    enableNative: true,
    debug: true,
    attachStacktrace: true,
    integrations: [new Sentry.Integrations.RewriteFrames()]
  });
  if (fs.existsSync(path)) {
    console.log('del: a');
    try {
      console.log('del: b');
      await del([path], { force: true });
      console.log('del: c');
    } catch (e) {
      console.error(e);
      Sentry.captureException(`${e}, Error while deleting addon path.`, {
        tags: {
          path: path,
        },
      });
      console.log('del: f');
      return [false, 'Error while deleting addon path.'];
    }

    console.log('del: d');
    return [true, 'Addon deleted successfully.'];
  }

  console.log('del: e');
  return [false, 'Addon path did not exist.'];
}
