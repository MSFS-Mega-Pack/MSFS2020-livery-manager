/**
 * @typedef {{ info: { name: string, localeId: string }, strings: Object }} LocaleData
 */

import { GetLocale, GetLocaleClass } from './LocaleHelpers';

/**
 * Class that represents a Locale.
 *
 * Contains its locale ID (e.g. en-GB), its name (e.g. "English (United Kingdom)"), and its strings.
 */
export default class Locale {
  locale;
  name;
  strings;

  /**
   * en-GB strings used if string isn't found in current translation pack
   * @private
   */
  _fallbackStrings;

  /**
   * Fetches a translation from the current locale based on a dot notation string (falling back on en-GB), and embeds any variables into it.
   *
   * @param {string} translationId Translation, referenced in dot notation (e.g. `settings.setting.community_folder.title`)
   * @param {object} variables Variables to use inside the translation (e.g. {percentage: "69%"})
   */
  translate(translationId, variables) {
    let translation;

    try {
      // find translation via dot notation
      try {
        translation = translationId.split('.').reduce((o, i) => o[i], this.strings);
      } catch {
        translation = translationId.split('.').reduce((o, i) => o[i], this._fallbackStrings);
      }

      if (typeof variables !== 'undefined') {
        translation = EmbedVariables(translation, variables);
      }
    } catch {
      // translation couldn't be found or is invalid
      translation = translationId;
    }

    return translation;
  }

  /**
   * @param {LocaleData} localeData
   */
  constructor(localeData) {
    this.locale = localeData.info.localeId;
    this.name = localeData.info.name;
    this.strings = localeData.strings;

    this._fallbackStrings = GetLocale('en-GB').strings;
  }
}

/**
 * Embeds variables inside a given translation
 *
 * @param {string} translation The fetched translation
 * @param {object} variables An object of variables to be embedded
 * @return {string} Complete translation
 */
function EmbedVariables(translation, variables) {
  let t = translation;

  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      const variable = variables[key];

      const regex = new RegExp(`{{${key}}}`, 'gi');

      // Replaces {{key}} in the translation with the content of
      // the passed variable
      t = t.replace(regex, variable);
    }
  }

  return t;
}
