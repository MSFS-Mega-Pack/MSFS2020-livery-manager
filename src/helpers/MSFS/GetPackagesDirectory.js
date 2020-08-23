const FS = require('fs').promises;
const Path = require('path');

const MSFS_DIRECTORY = Path.join(process.env.LOCALAPPDATA + '\\Packages\\Microsoft.FlightSimulator_8wekyb3d8bbwe\\');

/**
 * Get the directory which FS2020 was installed to
 *
 * @export
 * @return {String} path
 */
export default async function GetPackagesDirectory() {
  let cfg;

  // try {
  cfg = await FS.readFile(Path.join(MSFS_DIRECTORY, 'LocalCache\\UserCfg.opt'), 'utf-8');
  // } catch (error) {
  //   return null;
  // }

  if (typeof cfg !== 'string') {
    return null;
  }

  const cfgLines = cfg.split('\n');

  let installPath;

  cfgLines.forEach(line => {
    if (line.startsWith('InstalledPackagesPath')) {
      installPath = Path.resolve(line.slice('InstalledPackagesPath "'.length, -1));
    }
  });

  return installPath;
}
