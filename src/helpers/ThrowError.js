import Constants from '../data/Constants.json';

/**
 * Throws an error with a code and description.
 *
 * @export
 * @param {String} code Error code
 * @param {String} error Error description
 */
export default function ThrowError(code, error) {
  throw `${code}: ${error}\n\nMore details: ${Constants.urls.managerRepo}/blob/master/wiki/Errors.md#${code.toLowerCase()}`;
}
