/**
 * @typedef {{ info: { name: string, localeId: string }, strings: Object }} LocaleData
 */

/**
 * A function used to determine whether a string/strings should be pluralised.
 * @callback PluraliseFunction
 * @param {any} value Value to be checked
 * @returns {boolean} Whether text should be pluralised or not
 */

import { GetLocale } from './LocaleHelpers';

/**
 * Class that represents a Locale.
 *
 * Contains its locale ID (e.g. en-GB), its name (e.g. "English (United Kingdom)"), and its strings.
 *
 * Call .translate() on this class, passing a dot-notation translation ID to fetch a string.
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
   * @param {object=} variables Variables to use inside the translation (e.g. {percentage: "69%"})
   * @param {PluraliseFunction=} pluralisePredicate Used to determine whether the string should be pluralised, if applicable. Default is `false` for values of 1, `true` otherwise.
   */
  translate(translationId, variables, pluralisePredicate) {
    let translation;

    // default pluralisation (meant for ints only)
    const shouldPluralise = pluralisePredicate ? pluralisePredicate : value => (value === 1 ? false : true);

    try {
      // find translation via dot notation
      try {
        // try in this locale's strings first
        translation = translationId.split('.').reduce((o, i) => o[i], this.strings);
      } catch {
        translation = undefined;
      }

      // ...but if you can't find it there, use en-GB as a fallback
      if (typeof translation === 'undefined') {
        translation = translationId.split('.').reduce((o, i) => o[i], this._fallbackStrings);

        // if they STILL aren't there. use the translation ID instead.
        if (typeof translation === 'undefined') {
          return translationId;
        }
      }

      // parse variables and
      if (typeof variables !== 'undefined') {
        translation = EmbedVariables(translation, variables, shouldPluralise);
      }
    } catch {
      // If the translation still cannot be found in either set of strings, display the dot-notation ID instead
      translation = translationId;
    }

    return translation;
  }

  /**
   * Create a new locale. Requires the locale's JSON data.
   *
   * @param {LocaleData} localeData JSON locale data
   */
  constructor(localeData) {
    this.locale = localeData.info.localeId;
    this.name = localeData.info.name;
    this.strings = localeData.strings;

    this._fallbackStrings = GetLocale('en-GB').strings;
  }
}

/**
 * Embeds variables inside a given translation.
 *
 * @param {string} translation The fetched translation
 * @param {object} variables Variables to be embedded inside the translation
 * @param {PluraliseFunction=} shouldPluralise Used to determine whether the string should be pluralised, if applicable. Default is `false` for values of 1, `true` otherwise.
 * @return {string} Full translation with variables embedded
 */
function EmbedVariables(translation, variables, shouldPluralise) {
  if (typeof translation === 'undefined') {
    return 'translation_undefined_at_embed';
  } else if (typeof variables === 'undefined') {
    return translation;
  }

  try {
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

    t = Pluralise(t, variables, shouldPluralise);

    return t;
  } catch (e) {
    console.error('Failed to embed variables in translation.', translation, variables, e);
    return translation;
  }
}

/**
 * Pluralises a translation based on its variables and the pluralise function.
 *
 * @param {string} translation The fetched translation
 * @param {object} variables Variables to be embedded inside the translation
 * @param {PluraliseFunction=} shouldPluralise Used to determine whether the string should be pluralised, if applicable. Default is `false` for values of 1, `true` otherwise.
 * @return {string} Full translation with variables embedded
 */
function Pluralise(translation, variables, shouldPluralise) {
  const plurals = translation.match(/\[\[\w+\|\|\w+\|\w+\]\]/gi);
  // console.log(plurals, translation);

  if (plurals === null) return translation;

  let t = translation;

  plurals.forEach(full => {
    let str = full;
    const endVarIndex = str.indexOf('||');

    // name of variable [[<THIS>||...|...]]
    const varToCheck = str.substr(2, endVarIndex - 2);

    const [singular, plural] = str.substring(endVarIndex + 2, str.length - 2).split('|');

    // position of the matched string inside the overall string
    const pos = t.indexOf(full);
    const len = full.length;

    // If we're meant to pluralise, embed the plural in the string
    if (shouldPluralise(variables[varToCheck])) {
      t = t.substr(0, pos) + plural + t.substr(pos + len);
    } else {
      t = t.substr(0, pos) + singular + t.substr(pos + len);
    }
  });

  return t;
}
