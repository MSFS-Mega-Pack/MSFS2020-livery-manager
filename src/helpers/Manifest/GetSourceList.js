import Constants from '../../data/Constants.json';
import Contributor from '../../models/Contributor';
import SourceList from '../../models/SourceList';
import ActiveApiEndpoint from '../../data/ActiveApiEndpoint';

/**
 * Get the latest up-to-date master source list
 *
 * This doesn't check if each livery source URL is valid, but does fetch the master source list and check there aren't issues with it.
 *
 * @export
 * @return {SourceList}
 */
export default async function GetSourceList() {
  console.log("Fetching SourceList");

  const sourceList = await (await fetch(`${ActiveApiEndpoint}${Constants.api.get.sourceList}`)).json();
  
  console.log("Was cached: " + sourceList.cached);
  console.log("Cached at: " + sourceList.cachedAt);

  /** @type {import('../../models/Contributor').default[]} */
  let contributors = [];

  sourceList.data.contributors.forEach(contributor => {
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
    formatVersion: sourceList.data.formatVersion,
    formatType: sourceList.data.formatType,
    humanVersion: sourceList.data.humanVersion,
    versionCode: sourceList.data.versionCode,
    name: sourceList.data.name,
    description: sourceList.data.description,
    contributors: contributors,
    sources: sourceList.data.sources,
  });
}
