import getConfigInstance from '../helpers/getConfigInstance';
import CONFIG_KEYS from './config-keys.json';

export default () => getConfigInstance().get(CONFIG_KEYS.settings.show_advanced_settings) || false;
