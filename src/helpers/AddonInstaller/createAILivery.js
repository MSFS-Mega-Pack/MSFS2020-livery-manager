import * as parseCFG from '../MSFS/ConfigFiles/parseCFGFile';
import * as fs from 'fs';
import AllModelData from '../../data/AIModelData.json';
import * as Path from 'path';

const NoAIModelPlanes = ['Asobo_B747_8i'];

export default async function createAILivery(path) {
  if (!path.includes('SimObjects\\Airplanes')) path = Path.join(path, 'SimObjects', 'Airplanes');
  if (!fs.existsSync(path)) return console.log(path);

  let directories = await GetDirectories(path);
  let ModelAIPath = path + `\\${directories[0]}`;

  path = Path.join(path, directories[0], 'aircraft.cfg');

  const loaded = parseCFG.loadCFG(path);
  if (!loaded) return console.log('File not loaded');
  let AddonObject = parseCFG.parseCFGFile();
  console.log(AddonObject);

  let normalPlaneIndex = -1;
  const keys = parseCFG.getPlaneNumberKeys();

  for (let i = 0; i < keys.length; i++) {
    if (AddonObject.FLTSIM[keys[i]].isAirTraffic == 0 && AddonObject.FLTSIM[keys[i]].isUserSelectable == 1) {
      console.log(`Found potential AI convert: ${AddonObject.FLTSIM[keys[i]].title}`);
      normalPlaneIndex = keys[i];
    }
    if (
      (AddonObject.FLTSIM[keys[i]].isAirTraffic == 1 && AddonObject.FLTSIM[keys[i]].isUserSelectable == 0) ||
      (AddonObject.FLTSIM[keys[i]].isAirTraffic == 1 && AddonObject.FLTSIM[keys[i]].isUserSelectable == 1)
    ) {
      console.log(`Found Already existing AI: ${AddonObject.FLTSIM[i].title}`);
      normalPlaneIndex = -1;
    }
  }
  if (normalPlaneIndex == -1) return;

  console.log(`Converting: ${AddonObject.FLTSIM[normalPlaneIndex].title}`);
  let AIPlaneObject = AddonObject.FLTSIM[normalPlaneIndex];
  const aircraftModel = AddonObject.VARIATION.base_container.substring(AddonObject.VARIATION.base_container.lastIndexOf('\\') + 1);
  AIPlaneObject.title = `${AIPlaneObject.title} AI`;
  if (!NoAIModelPlanes.includes(aircraftModel)) {
    AIPlaneObject.model = `AI${AIPlaneObject.model}`;
  }
  AIPlaneObject.isAirTraffic = 1;
  AIPlaneObject.isUserSelectable = 0;

  ModelAIPath += `\\MODEL.${AIPlaneObject.model}`;
  console.log(ModelAIPath);
  if (!AllModelData[aircraftModel]) return console.log(aircraftModel);

  if (!NoAIModelPlanes.includes(aircraftModel)) {
    parseCFG.addAirplane(AIPlaneObject);
    return;
  }

  if (!fs.existsSync(ModelAIPath)) {
    fs.mkdirSync(ModelAIPath);
    fs.writeFile(`${ModelAIPath}\\model.cfg`, AllModelData[aircraftModel], function (err) {
      if (err) return console.log(err);
    });
    parseCFG.addAirplane(AIPlaneObject);
  }
}

async function GetDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}
