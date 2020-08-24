import GetSourceList from './GetSourceList';
import FetchAndParseJsonManifest from './FetchAndParseManifest';
import LiverySource from '../../models/LiverySource';
import Contributor from '../../models/Contributor';

/**
 * Convert an array of SourceLists into LiverySource classes.
 *
 * @return {LiverySource[]} Array of SourceLists
 *
 * @export
 * @param {Object[]=} sourcesList List of sources (if pre-fetched)
 */
export default async function GetLiverySources(sourcesList) {
  /** @type {SourceList[]} */
  let _sourcesList = sourcesList;

  if (typeof sourcesList === 'undefined') {
    _sourcesList = [await GetSourceList()];
  }

  /** @type {LiverySource[]} */
  let liverySources = [];

  await _sourcesList.forEach(async sourceList => {
    await sourceList.sources.forEach(async liverySourceURL => {
      let liverySourceManifest = await FetchAndParseJsonManifest(liverySourceURL, 'liverySource');

      /** @type {Contributor[]} */
      let contributors = [];

      liverySourceManifest.contributors.forEach(contributor => {
        contributors.push(
          new Contributor({
            name: contributor.name,
            discord: contributor.discord,
            github: contributor.github,
            twitter: contributor.twitter,
            msfsforums: contributor.msfsforums,
          })
        );
      });

      liverySources.push(
        new LiverySource({
          formatVersion: liverySourceManifest.formatVersion,
          formatType: liverySourceManifest.formatType,
          humanVersion: liverySourceManifest.humanVersion,
          versionCode: liverySourceManifest.versionCode,
          name: liverySourceManifest.name,
          description: liverySourceManifest.description,
          contributors: contributors,
          aircraftManifests: liverySourceManifest.aircraftManifests,
        })
      );
    });
  });

  return liverySources;
}
