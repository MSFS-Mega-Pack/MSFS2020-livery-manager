import request from 'request';
import { urls, api } from '../data/Constants.json';
import NodeRSA from 'node-rsa';

export default async function verifyClient(callback) {
  try {
    let UUID, encrypted, key;

    try {
      key = new NodeRSA(
        '-----BEGIN PUBLIC KEY-----\n' +
          'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQCGQ7fNnPHlNZI7EV1NX9WMUc\n' +
          '+3lnedklm4hgC6BmldXwbBIPJwmcFA02ArLr3LN7YZrXq+F9AJ/KEI/OEzTY9UQ1\n' +
          'QGQVep+tcTKQZUM412nYQr4vug+CVqNC3wvN1IT4jZR5nLdfAsikEKwMeKQzTuQY\n' +
          'fhiz52NAJJ+nrr/Q5wIDAQAB\n' +
          '-----END PUBLIC KEY-----',
        'public'
      );

      UUID = generateUUID().toString();
      encrypted = key.encrypt(UUID, 'base64');
    } catch (err) {
      return callback(false);
    }

    const options = {
      method: 'POST',
      url: `${urls.apiEndpoint}/${api.version}/${api.get.verify}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        info: encrypted,
      },
    };
    request(options, async function (error, response) {
      try {
        if (error) return callback(false);

        const res = JSON.parse(response.body);
        if (res.status == 'success' && res.data == UUID) {
          return callback(true);
        } else {
          return callback(false);
        }
      } catch (err) {
        return callback(false);
      }
    });
  } catch (err) {
    callback(false);
  }
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
