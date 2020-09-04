import fs from 'fs';
import ThrowError from '../../ThrowError';

let FILE_PATH = '';
const pathRegEx = /^[a-z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}[\]]+)+\.json$/i;

/**
 * Set path to a JSON file
 *
 * @export
 * @argument {String} path  Set path to JSON file
 */
export function loadJSON(path) {
  if (!pathRegEx.test(path) || !fs.lstatSync(path).isFile()) ThrowError('E005', `Invalid path ${path}`);
  FILE_PATH = path;
}

/**
 * Get data from JSON file
 *
 * @export
 * @argument {String} path  Set path to JSON file
 * @returns JSONObject
 */
export function getJSONData() {
  return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

/**
 * Check if path to file already exists in JSON
 *
 * @export
 * @argument {Object} jsonObject
 * @returns Boolean
 * @example doesPathExist({
  "path": "SimObjects/Airplanes/Asobo_A320_NEO/TEXTURE.AERLINGUS/A320NEO_AIRFRAME_FUSELAGE_ALBD.PNG.DDS.json",
  "size": 102,
  "date": 132398508745510484
})
 */
export function doesPlaneInfoExist(jsonObject) {
  const data = getJSONData();
  for (let i = 0; i < data.content.length; i++) {
    if (data.content[i].path == jsonObject.path) return true;
  }
  return false;
}

/**
 * Add planeInfo to layout file
 *
 * @export
 * @argument {Object} jsonObject
 * @example addPlaneInfo({
  "path": "SimObjects/Airplanes/Asobo_A320_NEO/TEXTURE.AERLINGUS/A320NEO_AIRFRAME_FUSELAGE_ALBD.PNG.DDS.json",
  "size": 102,
  "date": 132398508745510484
})
 */
export function addPlaneInfo(jsonObject) {
  let data = getJSONData();
  if (typeof jsonObject.path != 'string') ThrowError('E006', `Missing JSON data: path`);
  if (typeof jsonObject.size != 'number') jsonObject.size = 2796344;
  if (typeof jsonObject.date != 'number') jsonObject.date = 132270122080000000;

  data.push(jsonObject);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 4));
}

/**
 * Remove plane entry from layout file, searches for the texture/json path in the layout.json and removes the object
 *
 * @export
 * @argument {String} texturePath
 * @example deletePlaneInfo("SimObjects/Airplanes/Asobo_A320_NEO/TEXTURE.AERLINGUS/A320NEO_AIRFRAME_FUSELAGE_ALBD.PNG.DDS.json")
 */
export function deletePlaneInfo(texturePath) {
  let data = getJSONData();
  for (let i = 0; i < data.content.length; i++) {
    if (data.content[i].path == texturePath) {
      data.content.splice(i, 1);
      break;
    }
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 4));
}
