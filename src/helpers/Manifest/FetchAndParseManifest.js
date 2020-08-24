/**
 * Fetches a manifest URL, parses it as JSON and throws errors if something isn't right.
 *
 * Also accepts a [manifestType] param to check the fetched manifest type against.
 *
 * @export
 *
 * @param {string} url
 * @param {("sourceList"|"liverySource"|"aircraftManifest"|"liveryManifest")=} manifestType
 *
 * @return {Object} manifest JSON
 */
export default async function FetchAndParseJsonManifest(url, manifestType) {
  let response;

  try {
    response = await fetch(url);
  } catch {
    throw 'E002: Manifest fetch failed\n\nAttempted to fetch URL ' + url;
  }

  if (!response.clone().ok) {
    throw 'E003: Manifest fetch response not OK\n\nAttempted to fetch ' + url;
  }

  let manifest;

  try {
    manifest = await response.clone().json();
  } catch {
    ThrowError('E004', 'Malformed manifest (invalid JSON)');
  }

  if (manifestType && manifest.formatType !== manifestType) {
    // Invalid manifest format
    ThrowError('E001', 'Invalid manifest format');
  }

  return manifest;
}
