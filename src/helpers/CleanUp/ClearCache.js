import { remote } from 'electron';
import Constants from '../../data/Constants.json';
import Path from 'path';
import { promises as fs } from 'fs';

export default async function ClearCache() {
  const tempPath = Path.join(remote.app.getPath('temp'), Constants.appName, Constants.dirs.downloadCache);

  await fs.rmdir(tempPath, { recursive: true });

  return true;
}
