import fetch from 'node-fetch';
import Constants from '../../data/Constants.json';
import ActiveApiEndpoint from '../../data/ActiveApiEndpoint';

export default async function AddLiveryInstallAnalytic(liveryName) {
  console.log('Reporting livery install to analytics API:', liveryName);
  try {
    fetch(`${ActiveApiEndpoint}/${Constants.api.get.addLiveryStat}/${liveryName}`).catch(err => {
      console.log(err);
    });
  } catch (e) {
    console.log(e);
  }
}
