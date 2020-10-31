import ThrowError from '../ThrowError';

/**
 * Fetches a manifest URL, parses it as JSON and throws errors if something isn't right.
 *
 * Also accepts a [manifestType] param to check the fetched manifest type against.
 *
 * @export
 *
 * @param {string} url
 *
 * @return {Object} manifest JSON
 */
export default async function FetchAndParseJsonManifest(url) {
  let response;

  try {
    response = await fetch(url);
  } catch {
    ThrowError('E002', 'Manifest fetch failed\n\nAttempted to fetch URL ' + url);
  }

  if (!response.clone().ok) {
    ThrowError('E003', 'Manifest fetch response not OK\n\nAttempted to fetch ' + url);
  }

  let manifest;

  try {
    manifest = await response.clone().json();
  } catch {
    ThrowError('E004', 'Malformed response (invalid JSON)');
  }

  return manifest;
}
