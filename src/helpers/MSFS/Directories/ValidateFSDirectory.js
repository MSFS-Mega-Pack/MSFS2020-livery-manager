import fs from 'fs';

/**
 * Check if a chosen path is a valid FS2020 installation path
 *
 * @export
 * @param {string} path Chosen FS2020 install path
 * @param {import('../../../locales/Locale').default} CurrentLocale The current locale
 * @return {[boolean, string]} [0]: is path valid, [1]: error message
 */
export default function ValidateFSDirectory(path, CurrentLocale) {
  if (!path || path.trim() === '')
    return [
      false,
      CurrentLocale
        ? CurrentLocale.translate('helpers.validate_fs_directory.choose_directory')
        : 'helpers.validate_fs_directory.choose_directory',
    ];

  let p = path.endsWith('/') || path.endsWith('\\') ? path.slice(0, -1) : path;

  if (!fs.existsSync(p)) {
    return [
      false,
      CurrentLocale
        ? CurrentLocale.translate('helpers.validate_fs_directory.path_doesnt_exist')
        : 'helpers.validate_fs_directory.path_doesnt_exist',
    ];
  } else if (!p.toLowerCase().endsWith('community')) {
    return [
      false,
      CurrentLocale ? CurrentLocale.translate('helpers.validate_fs_directory.invalid_path') : 'helpers.validate_fs_directory.invalid_path',
    ];
  } else {
    return [true, ''];
  }
}
