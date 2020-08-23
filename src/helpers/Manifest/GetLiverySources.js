import Constants from '../../data/Constants.json';
import ThrowError from '../ThrowError';

/**
 * Get an array of all `liverySource` manifest URLs
 *
 * This doesn't check if each URL is valid, but does fetch the master source list and check there aren't issues with it.
 *
 * @export
 * @return {string[]} `liverySource` manifest URLs
 */
export default async function GetLiverySources() {
  const url = Constants.urls.officialSourceList;

  let response;

  try {
    response = await fetch(url);
  } catch {
    throw 'E002: Source list fetch failed';
  }

  if (!response.clone().ok) {
    throw 'E003: Source list fetch response not OK\n\nAttempted to fetch ' + url;
  }

  let sourceList;
  try {
    sourceList = await response.clone().json();
  } catch {
    ThrowError('E005', 'Malformed manifest (invalid JSON)');
  }

  if (sourceList.formatType !== 'sourceList') {
    // Invalid manifest format
    ThrowError('E001', 'Invalid source list manifest format');
  }

  if (!Array.isArray(sourceList.sources) || sourceList.sources.length < 1) {
    // No valid sources array
    ThrowError('E004', "Source list doesn't have valid `sources` array");
  }

  if (!sourceList.sources.every(s => typeof s === 'string')) {
    // Sources array not all strings
    ThrowError('E006', '`sources` array contains types other than strings');
  }

  return sourceList.sources;
}
