import Config from 'electron-json-config';
import CONFIG_KEYS from './config-keys.json';

export default () => Config.get(CONFIG_KEYS.settings.show_advanced_settings) || false;
