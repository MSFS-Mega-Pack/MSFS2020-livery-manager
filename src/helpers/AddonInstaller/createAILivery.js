import * as parseCFG from '../MSFS/ConfigFiles/parseCFGFile';

export default function createAILivery(path){
    const loaded = parseCFG.loadCFG(path);
    if(!loaded) return console.log("File not loaded");
    let AddonObject = parseCFG.parseCFGFile();
    console.log(AddonObject);
    for(let i = 0; i < AddonObject.FLTSIM.length; i++){
        if(AddonObject.FLTSIM[i].isAirTraffic == 1) return;
    }

}