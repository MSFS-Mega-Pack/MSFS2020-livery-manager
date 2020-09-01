import React, { useState } from 'react';

import { Typography, CircularProgress, Link, Box, Button } from '@material-ui/core';

import GetActiveFeed from '../../../helpers/Feed/GetActiveFeed';
import FetchAndParseJsonManifest from '../../../helpers/Manifest/FetchAndParseManifest';

import ArticleClass from '../../../models/Feed/Article';
import Article from './Article';

export default function Feed() {
  /**
   * @type {[import("../../../models/Feed/Feed").default, Function]}
   */
  const [feed, setFeed] = useState(undefined);
  /**
   * @type {[import("../../../models/Feed/Feed").default, Function]}
   */
  const [fullHistory, setFullHistory] = useState(null);

  if (typeof feed === 'undefined') {
    GetActiveFeed()
      .then(f => setFeed(f))
      .catch(() => {
        setFeed(null);
      });
  }

  if (typeof feed === 'undefined') {
    return (
      <div style={{ display: 'flex', flex: '1', alignItems: 'center', justifyContent: 'center', marginTop: -64 }}>
        <CircularProgress size={48} />
      </div>
    );
  }

  if (feed === null) {
    return (
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 'max-content', transform: 'translate(-50%,-50%)' }}>
        <Typography variant="h5" component="p">
          An error occurred while loading the news feed.
        </Typography>
        <Typography variant="caption" component="p" style={{ position: 'absolute', bottom: -24, right: 0, cursor: 'pointer' }}>
          <Link onClick={() => alert("Feed was of value 'null'.")}>More info</Link>
        </Typography>
      </div>
    );
  }

  return (
    <div style={{ flex: '1' }}>
      {fullHistory
        ? fullHistory.map(a => <Article article={a} key={`${a.date}__${a.title}__${a.author}`} />)
        : feed.feed.map(a => <Article article={a} key={`${a.date}__${a.title}__${a.author}`} />)}
      <Box display="flex" alignItems="center" flexDirection="column" padding={4} paddingBottom={8}>
        {!feed.isMoreHistoryAvailable || fullHistory ? (
          <>
            <Typography style={{ paddingBottom: 2 }} variant="body1">
              That&apos;s all folks!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              You&apos;ve reached the start of the update feed
            </Typography>
          </>
        ) : (
          <div style={{ position: 'relative' }}>
            <Button
              variant="outlined"
              onClick={async () => {
                setFullHistory(false);

                await FetchAndParseJsonManifest(feed.rootUrl + feed.historyUrl).then(async history => {
                  let x = [];

                  await Promise.all(
                    history.fullHistory.map(async article => {
                      let text;

                      if (article.contentUrl) {
                        text = await (await fetch(feed.rootUrl + article.contentUrl)).text();
                      }

                      const a = new ArticleClass({
                        date: article.date,
                        title: article.title,
                        author: article.author,
                        content: article.content || text,
                      });

                      x.push(a);
                    })
                  );

                  setFullHistory(x);
                });
              }}
              disabled={fullHistory === false}
            >
              Read all updates
            </Button>
            {fullHistory === false && (
              <CircularProgress size={24} style={{ top: '50%', left: '50%', position: 'absolute', marginTop: -12, marginLeft: -12 }} />
            )}
          </div>
        )}
      </Box>
    </div>
  );
}
