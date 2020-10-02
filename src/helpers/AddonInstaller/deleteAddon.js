import fs from 'fs';
import Path from 'path';


/**
 * Remove installed addon by Path
 *
 * @export
 * @argument {String} Path, remove addon by path.
 * @return {Boolean} Removed the addon true/false
 */
export default async function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        await deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
    return true;
  }
  return false;
};