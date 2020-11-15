import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Typography, CircularProgress, Link, Box, Button } from '@material-ui/core';

import GetActiveFeed from '../../../helpers/Feed/GetActiveFeed';
import GetFeedHistory from '../../../helpers/Feed/GetFeedHistory';

import FeedClass from '../../../models/Feed';
import Article from './Article';
import LocaleContext from '../../../locales/LocaleContext';
import IsDev from '../../../data/IsDev';

export default function Feed(props) {
  const CurrentLocale = React.useContext(LocaleContext);

  /**
   * @type {[FeedClass, Function]}
   */
  const [feed, setFeed] = [props.feed, props.setFeed];

  /**
   * @type {[FeedClass, Function]}
   */
  const [fullHistory, setFullHistory] = [props.fullHistory, props.setFullHistory];

  if (typeof feed === 'undefined') {
    GetActiveFeed()
      .then(f => setFeed(f))
      .catch(() => setFeed(null));

    return (
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        <CircularProgress size={48} />
      </div>
    );
  }

  if (!(feed instanceof FeedClass)) {
    return (
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 'max-content', transform: 'translate(-50%,-50%)' }}>
        <Typography variant="h5" component="p">
          {CurrentLocale.translate('manager.pages.feed.errors.generic_message')}
        </Typography>
        <Typography variant="caption" component="p" style={{ position: 'absolute', bottom: -24, right: 0, cursor: 'pointer' }}>
          <Link
            onClick={() => {
              let error = CurrentLocale.translate('manager.pages.feed.errors.unknown_error');

              if (typeof feed === 'string') error = feed;
              else if (feed === null) error = CurrentLocale.translate('manager.pages.feed.errors.feed_unknown');

              alert(error);
            }}
          >
            {CurrentLocale.translate('manager.pages.feed.error_more_info_button')}
          </Link>
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
              {CurrentLocale.translate('manager.pages.feed.no_more_posts.heading')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {CurrentLocale.translate('manager.pages.feed.no_more_posts.info')}
            </Typography>
          </>
        ) : (
          <div style={{ position: 'relative' }}>
            <Button
              variant="outlined"
              onClick={async () => {
                setFullHistory(false);
                const feed = await GetFeedHistory();
                setFullHistory(feed);
              }}
              disabled={fullHistory === false}
            >
              {CurrentLocale.translate('manager.pages.feed.view_more_updates_button')}
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

Feed.propTypes = {
  fullHistory: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      article: PropTypes.string.isRequired,
    }).isRequired
  ),
  setFullHistory: PropTypes.func.isRequired,
  feed: PropTypes.shape({
    isMoreHistoryAvailable: PropTypes.bool.isRequired,
    feed: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.instanceOf(Date).isRequired,
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        article: PropTypes.string,
      }).isRequired
    ).isRequired,
  }),
  setFeed: PropTypes.func.isRequired,
};
