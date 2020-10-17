import Constants from './Constants.json';
import IsDev from './IsDev';

const endpointBase = IsDev && !Constants.api.forceProdApi ? Constants.urls.devApiEndpoint : Constants.urls.apiEndpoint;

const ActiveApiEndpoint = `${endpointBase}/${Constants.api.version}`;

export default ActiveApiEndpoint;
