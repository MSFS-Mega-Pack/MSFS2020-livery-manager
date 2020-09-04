import fs from 'fs';
import * as ini from './parser';
import ThrowError from '../../ThrowError';

let CFGpath = '';
const pathRegEx = /^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}[\]]+)+\.cfg$/i;

/**
 * Set path to a CFG file
 *
 * @export
 * @argument {String} path  Set path to CFG file
 */
export function loadCFG(path) {
  CFGpath = path;
  console.log(path);
}

/**
 * Parse chosen CFG file and return it
 *
 * @export
 * @return {Object} JSON object with the CFG file data
 */
export function parseCFGFile() {
  if (!pathRegEx.test(CFGpath) || !fs.lstatSync(CFGpath).isFile()) ThrowError('E005', `Invalid path ${CFGpath}`);
  const data = ini.parse(fs.readFileSync(CFGpath, 'utf8'));
  console.log(data);
  return data;
}
