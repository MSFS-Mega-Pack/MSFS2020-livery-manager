import fs from 'fs';
import del from 'del';

/**
 * Remove installed addon by Path
 *
 * @export
 * @param {string} Path, remove addon by path.
 * @param {import("../../locales/Locale").default} CurrentLocale current locale (from context)
 * @return {Promise<[boolean, string]>} Removed the addon true/false
 */
export default async function DeleteAddon(path, CurrentLocale) {
  const Constants = require('../../data/Constants.json');
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
      return [false, CurrentLocale.translate('helpers.delete_addon.delete_path_fail')];
    }

    console.log('del: d');
    return [true, CurrentLocale.translate('helpers.delete_addon.delete_path_success')];
  }

  console.log('del: e');
  return [false, CurrentLocale.translate('helpers.delete_addon.non_existant')];
}
