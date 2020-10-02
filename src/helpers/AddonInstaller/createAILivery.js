import * as parseCFG from '../MSFS/ConfigFiles/parseCFGFile';
import * as fs from 'fs';
import AllModelData from '../../data/AIModelData.json';

export default async function createAILivery(path) {
  if (!path.includes('SimObjects\\Airplanes')) path += 'SimObjects\\Airplanes';
  if (!fs.existsSync(dir)) return console.log(dir);

  let directories = await GetDirectories(dir);
  let ModelAIPath = path + `\\${directories[0]}`;
  path += `\\${directories[0]}\\aircraft.cfg`;

  const loaded = parseCFG.loadCFG(path);
  if (!loaded) return console.log('File not loaded');
  let AddonObject = parseCFG.parseCFGFile();
  console.log(AddonObject);

  let normalPlaneIndex = -1;
  for (let i = 0; i < AddonObject.FLTSIM.length; i++) {
    if (AddonObject.FLTSIM[i].isAirTraffic == 0 && AddonObject.FLTSIM[i].isUserSelectable == 1) {
      console.log(`Found potential AI convert: ${AddonObject.FLTSIM[i].title}`);
      normalPlaneIndex = i;
    }
    if (
      (AddonObject.FLTSIM[i].isAirTraffic == 1 && AddonObject.FLTSIM[i].isUserSelectable == 0) ||
      (AddonObject.FLTSIM[i].isAirTraffic == 1 && AddonObject.FLTSIM[i].isUserSelectable == 1)
    ) {
      console.log(`Found Already existing AI: ${AddonObject.FLTSIM[i].title}`);
      normalPlaneIndex = -1;
    }
  }
//   if (normalPlaneIndex == -1) return;
//   console.log(`Converting: ${AddonObject.FLTSIM[i].title}`);
//   let AIPlaneObject = AddonObject.FLTSIM[normalPlaneIndex];
//   AIPlaneObject.title = `${AIPlaneObject.title} AI`;
//   AIPlaneObject.model = `AI${AIPlaneObject.model}`;
//   AIPlaneObject.isAirTraffic = 1;
//   AIPlaneObject.isUserSelectable = 0;

//   ModelAIPath += `\\MODEL.${AIPlaneObject.model}`;
//   console.log(ModelAIPath);
//   const aircraftModel = AddonObject.VARIATION.base_container.substring(AddonObject.VARIATION.base_container.lastIndexOf('\\') + 1);
//   if (!AllModelData[aircraftModel]) return console.log(aircraftModel);
//   if (!fs.existsSync(ModelAIPath)) {
//     fs.mkdirSync(ModelAIPath);
//     fs.writeFile(`${ModelAIPath}\\model.cfg`, AllModelData[aircraftModel], function (err) {
//       if (err) return console.log(err);
//     });
//   }
}

const GetDirectories = async (path = '.') =>
  (await stat(path)).isDirectory() ? Promise.all(await readdir(path)).then(results => [].concat(...results)) : [];
