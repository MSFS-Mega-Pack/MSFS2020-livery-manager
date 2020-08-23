import Constants from '../data/Constants.json';

export default function ThrowError(code, error) {
  throw `${code}: ${error}\n\nMore details: ${Constants.urls.managerRepo}/blob/master/wiki/Errors.md#${code.toLowerCase()}`;
}
