import FetchAndParseJsonManifest from '../Manifest/FetchAndParseManifest';

import Article from '../../models/Article';
import Feed from '../../models/Feed';

import Constants from '../../data/Constants.json';
import ActiveApiEndpoint from '../../data/ActiveApiEndpoint';

export default async function GetActiveFeed() {
  let feed;
  try {
    feed = (await FetchAndParseJsonManifest(`${ActiveApiEndpoint}/${Constants.api.get.feed}`)).data;
  } catch {
    return 'Failed to fetch current feed from API.';
  }

  /** @type {Article[]} */
  let feedArticles = [];

  await Promise.all(
    feed.feed.map(async article => {
      let text;

      if (article.article) {
        try {
          text = (await FetchAndParseJsonManifest(`${ActiveApiEndpoint}/${Constants.api.get.article}/${article.article}`)).data;
        } catch {
          text =
            'Failed to fetch article. If this continues, [report this to the developers](https://github.com/MSFS-Mega-Pack/MSFS2020-livery-manager/issues/new).\n\nInfo: `fetch` failed in `GetActiveFeed.js`';
        }
      }

      const a = new Article({
        date: article.date,
        title: article.title,
        author: article.author,
        content:
          text ||
          'Failed to fetch article. If this continues, [report this to the developers](https://github.com/MSFS-Mega-Pack/MSFS2020-livery-manager/issues/new).',
      });

      feedArticles.push(a);
    })
  );

  feedArticles = feedArticles.sort((a, b) => b.date - a.date);

  return new Feed(feed.formatVersion, feed.formatType, feedArticles, feed.isMoreHistoryAvailable);
}
