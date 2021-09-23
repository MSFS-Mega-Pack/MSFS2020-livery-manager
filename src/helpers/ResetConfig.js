import defaultConfig from '../data/default-config';
import getConfigInstance from './getConfigInstance';

export default function ResetConfig() {
  const config = getConfigInstance();

  config.purge();
  config.setBulk(defaultConfig);
}
