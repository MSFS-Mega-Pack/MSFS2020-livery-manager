import fs from 'fs';
import ini from 'ini';

let CFGpath = "E:/Games/Flight Simulator/Community/liveries_template/SimObjects/Airplanes/Asobo_A320_NEO/aircraft.cfg";

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

export default function parseCFGFile() {
    if (CFGpath == "") return;
    const data = ini.parse(fs.readFileSync(CFGpath, 'utf8'));
    console.log(data);
    return data
}