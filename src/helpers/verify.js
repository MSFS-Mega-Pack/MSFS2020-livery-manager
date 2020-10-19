// const Trigger403 = require('../../default');
import * as request from 'request';
import * as constants from '../data/Constants.json';

export default async function verifyClient() {
  const NodeRSA = require('node-rsa');

  const key = new NodeRSA(
    '-----BEGIN PUBLIC KEY-----\n' +
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQCGQ7fNnPHlNZI7EV1NX9WMUc\n' +
      '+3lnedklm4hgC6BmldXwbBIPJwmcFA02ArLr3LN7YZrXq+F9AJ/KEI/OEzTY9UQ1\n' +
      'QGQVep+tcTKQZUM412nYQr4vug+CVqNC3wvN1IT4jZR5nLdfAsikEKwMeKQzTuQY\n' +
      'fhiz52NAJJ+nrr/Q5wIDAQAB\n' +
      '-----END PUBLIC KEY-----',
    'public'
  );

  const UUID = generateUUID().toString();
  const encrypted = key.encrypt(UUID, 'base64');

  const options = {
    method: 'POST',
    url: `${constants.urls.apiEndpoint}/${constants.api.version}/${constants.api.get.verify}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: {
      info: encrypted,
    },
  };
  new Promise(function (resolve, reject) {
    request(options, function (error, response) {
      try {
        if (error) return resolve(false);

        const res = JSON.parse(response.body);
        if (res.status == 'success' && res.data == UUID) {
          return resolve(true);
        }
        return resolve(false);
      } catch (err) {
        return resolve(false);
      }
    });
  });
}

function generateUUID() {
  let d = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid.toString();
}
