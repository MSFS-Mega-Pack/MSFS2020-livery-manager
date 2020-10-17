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
  if (fs.existsSync(path)) {
    console.log('del: a');
    try {
      console.log('del: b');
      await del([path], { force: true });
      console.log('del: c');
    } catch (e) {
      console.error(e);
      console.log('del: f');
      return [false, 'Error while deleting addon path.'];
    }

    console.log('del: d');
    return [true, 'Addon deleted successfully.'];
  }

  console.log('del: e');
  return [false, 'Addon path did not exist.'];
}
