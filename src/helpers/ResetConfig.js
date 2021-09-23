import defaultConfig from '../data/default-config';

export default function ResetConfig() {
  const config = getConfigInstance();

  config.purge();
  config.setBulk(defaultConfig);
}
