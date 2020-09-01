import FetchAndParseJsonManifest from '../Manifest/FetchAndParseManifest';

import Article from '../../models/Feed/Article';
import Feed from '../../models/Feed/Feed';

import Constants from '../../data/Constants.json';

export default async function GetActiveFeed() {
  const feed = await FetchAndParseJsonManifest(Constants.urls.feedUrl, 'feed');

  /** @type {Article[]} */
  let feedArticles = [];

  await Promise.all(
    feed.feed.map(async article => {
      let text;

      if (article.contentUrl) {
        text = await (await fetch(feed.rootUrl + article.contentUrl)).text();
      }

      const a = new Article({
        date: article.date,
        title: article.title,
        author: article.author,
        content: article.content || text,
      });

      feedArticles.push(a);
    })
  );

  feedArticles = feedArticles.sort((a, b) => b.date - a.date);

  return new Feed(feed.formatVersion, feed.formatType, feed.rootUrl, feed.history, feed.isMoreHistoryAvailable, feedArticles);
}
