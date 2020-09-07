import Constants from './Constants.json';
import IsDev from './IsDev';

const ActiveApiEndpoint = IsDev ? Constants.urls.devApiEndpoint : Constants.urls.apiEndpoint;

export default ActiveApiEndpoint;
