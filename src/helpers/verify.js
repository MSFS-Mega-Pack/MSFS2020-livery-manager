const request = require('request');
const { urls, api } = require('../data/Constants.json');
const NodeRSA = require('node-rsa');

/**
 * Verifies that the API endpoint being queried is valid. This prevents any hostile
 * takeovers in the case of domain expiry, etc.
 *
 * If verification fails, we fall back to a secondary API URL, then validate that. If
 * that also fails verification, we're fucked.
 *
 * @param {function} callback
 */
async function verifyClient(callback) {
  try {
    let UUID, encrypted, key;

    try {
      // API public key
      key = new NodeRSA(
        '-----BEGIN PUBLIC KEY-----\n' +
          'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCQCGQ7fNnPHlNZI7EV1NX9WMUc\n' +
          '+3lnedklm4hgC6BmldXwbBIPJwmcFA02ArLr3LN7YZrXq+F9AJ/KEI/OEzTY9UQ1\n' +
          'QGQVep+tcTKQZUM412nYQr4vug+CVqNC3wvN1IT4jZR5nLdfAsikEKwMeKQzTuQY\n' +
          'fhiz52NAJJ+nrr/Q5wIDAQAB\n' +
          '-----END PUBLIC KEY-----',
        'public'
      );

      // encrypt UUID with public key
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

    // send encrypted data to API
    request(options, async function (error, response) {
      try {
        if (error) return callback(false);

        const res = JSON.parse(response.body);
        if (res.status == 'success' && res.data == UUID) {
          // API verified successfully
          return callback(true);
        } else {
          // Verification failed
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

// generates a random UUID
function generateUUID() {
  let d = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid.toString();
}

module.exports = { verifyClient };
