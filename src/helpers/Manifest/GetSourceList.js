import Constants from '../../data/Constants.json';
import Contributor from '../../models/Contributor';
import SourceList from '../../models/SourceList';
import ThrowError from '../ThrowError';
import FetchAndParseJsonManifest from './FetchAndParseManifest';

/**
 * Get the latest up-to-date master source list
 *
 * This doesn't check if each livery source URL is valid, but does fetch the master source list and check there aren't issues with it.
 *
 * @export
 * @return {SourceList}
 */
export default async function GetSourceList() {
  const url = Constants.urls.officialSourceList;

  const sourceList = await FetchAndParseJsonManifest(url, 'sourceList');

  /** @type {Contributor[]} */
  let contributors = [];

  sourceList.contributors.forEach(contributor => {
    contributors.push(
      new Contributor({
        name: contributor.name,
        discord: contributor.discord,
        twitter: contributor.twitter,
        github: contributor.github,
        msfsforums: contributor.msfsforums,
      })
    );
  });

  return new SourceList({
    formatVersion: sourceList.formatVersion,
    formatType: sourceList.formatType,
    humanVersion: sourceList.humanVersion,
    versionCode: sourceList.versionCode,
    name: sourceList.name,
    description: sourceList.description,
    contributors: contributors,
    sources: sourceList.sources,
  });
}
