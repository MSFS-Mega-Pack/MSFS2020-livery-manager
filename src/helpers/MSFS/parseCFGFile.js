import fs from 'fs';
import ini from '../Manifest/CFGFileParser.js';
import ThrowError from '../ThrowError';

let CFGpath = "";
const pathRegEx = /^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}\[\]]+)+\.cfg$/i;

/**
 * Set path to a CFG file
 *
 * @export
 * @argument {String} path  Set path to CFG file
 */

export function loadCFG(path) {
    CFGpath = path;
    console.log(path)
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

export function getHighestPlaneNumber() {
    let highest = 0;
    const data = parseCFGFile()
    Object.keys(data.FLTSIM).forEach(function (key) {
        if (parseInt(key) > highest) highest = parseInt(key);
    })
    console.log(highest);
    return highest;
}