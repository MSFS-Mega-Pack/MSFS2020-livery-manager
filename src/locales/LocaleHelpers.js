import * as Locales from './index';
import Locale from './Locale';

/**
 * Returns a list of all available locales for the manager
 *
 * @return {import("./Locale").LocaleData[]}
 */
export function GetAllLocales() {
  /** @type {import("./Locale").LocaleData[]} */
  let all = [];

  for (const locale in Locales) {
    console.log(Locales[locale]);
    all.push({ ...Locales[locale].default, dayJsLocale: Locales[locale].dayJsLocale });
  }

  return all;
}

/**
 * Fetch a locale by its ID
 *
 * @param {string} localeId A valid locale ID (falls back to en-GB)
 * @return {import("./Locale").LocaleData}
 */
export function GetLocale(localeId) {
  return GetAllLocales().find(locale => locale.info.localeId === localeId) || Locales.enGB;
}

/**
 * Fetch a locale class by its ID
 *
 * @param {string} localeId A valid locale ID (falls back to en-GB)
 * @param {function} setLocale A function called to update the current locale
 * @return {Locale}
 */
export function GetLocaleClass(localeId, setLocale) {
  return new Locale({ ...GetLocale(localeId), setLocale });
}
