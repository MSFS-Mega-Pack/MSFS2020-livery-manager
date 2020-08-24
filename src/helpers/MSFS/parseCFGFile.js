import fs from 'fs';
import ini from '../Manifest/CFGFileParser.js';
import ThrowError from '../ThrowError';

let CFGpath = "E:/Games/Flight Simulator/Community/liveries_template/SimObjects/Airplanes/Asobo_A320_NEO/aircraft.cfg";
const pathRegEx = /^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}\[\]]+)+\.cfg$/i;

export function loadCFG(path) {
    CFGpath = path;
    console.log(path)
}
/**
 * Check if a chosen path is a valid FS2020 installation path
 *
 * @export
 * @return {String} [0]: is path valid, [1]: error message
 */

export function parseCFGFile() {
    if (!pathRegEx.test(CFGpath) || !fs.lstatSync(CFGpath).isFile()) return ThrowError('E007', `Invalid path ${CFGpath}`);
    const data = ini.parse(fs.readFileSync(CFGpath, 'utf8'));
    console.log(data);
    return data
}