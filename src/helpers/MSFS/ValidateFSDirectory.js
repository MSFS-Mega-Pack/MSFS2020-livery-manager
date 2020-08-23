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

  if (p.endsWith('Community') || p.endsWith('Official')) {
    return [false, 'Did you choose one of the folders inside your installation directory? Choose the folder with the folders "Community" and "Official" inside.'];
  } else if (!fs.existsSync(Path.join(path, '\\Community'))) {
    return [false, 'The chosen folder seems to be missing one or more subdirectories. Did you select the right folder?'];
  } else {
    return [true, ''];
  }
}
