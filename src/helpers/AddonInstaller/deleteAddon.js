import fs from 'fs';
import Path from 'path';

/**
 * Remove installed addon by Path
 *
 * @export
 * @argument {string} Path, remove addon by path.
 * @return {[boolean, string]} Removed the addon true/false
 */
export default async function DeleteAddon(path) {
  if (fs.existsSync(path)) {
    try {
      await fs.promises.rmdir(Path.resolve(path), { recursive: true });
    } catch (e) {
      console.error(e);
      return [false, 'Error while deleting addon path.'];
    }
    return [true, 'Addon deleted successfully.'];
  }

  return [false, 'Addon path did not exist.'];
}
