import FetchAndParseJsonManifest from '../Manifest/FetchAndParseManifest';

import Article from '../../models/Article';
import Feed from '../../models/Feed';

import Constants from '../../data/Constants.json';
import ActiveApiEndpoint from '../../data/ActiveApiEndpoint';

/**
 * Gets the full feed from the API
 *
 * @param {import("../../locales/Locale").default} CurrentLocale current locale (from context)
 *
 * @returns {string|Feed} String, if error, instance of Feed is successful
 */
export default async function GetFeedHistory(CurrentLocale) {
  let feed;
  try {
    feed = (await FetchAndParseJsonManifest(`${ActiveApiEndpoint}/${Constants.api.get.feedHistory}`)).data;
  } catch {
    return CurrentLocale.translate('helpers.get_feed_history.fetch_fail');
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
          text = CurrentLocale.translate('helpers.get_feed_history.fetch_fail_article_text');
        }
      }

      const a = new Article({
        date: article.date,
        title: article.title,
        author: article.author,
        content: text || CurrentLocale.translate('helpers.get_feed_history.fetch_fail_article_text'),
        CurrentLocale,
      });

      feedArticles.push(a);
    })
  );

  feedArticles = feedArticles.sort((a, b) => b.date - a.date);

  return new Feed(feed.formatVersion, feed.formatType, feedArticles);
}
