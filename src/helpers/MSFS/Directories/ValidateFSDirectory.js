import fs from 'fs';
import Path from 'path';

/**
 * Check if a chosen path is a valid FS2020 installation path
 *
 * @export
 * @param {String} path Chosen FS2020 install path
 * @return {Array} [0]: is path valid, [1]: error message
 */
export default function ValidateFSDirectory(path) {
  if (path.trim() === '') return [false, 'Please choose a directory'];

  let p = path.endsWith('/') || path.endsWith('\\') ? path.slice(0, -1) : path;

  if (!fs.existsSync(p)) {
    return [false, "The path you've selected doesn't exist."];
  } else if (!p.toLowerCase().endsWith('community')) {
    return [false, "Please make sure you've selected your Community folder."];
  } else {
    return [true, ''];
  }
}
