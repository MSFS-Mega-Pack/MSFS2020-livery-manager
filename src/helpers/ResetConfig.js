import Config from 'electron-json-config';
import defaultConfig from '../data/default-config';

export default function ResetConfig() {
  Config.purge();
  Config.setBulk(defaultConfig);
}
