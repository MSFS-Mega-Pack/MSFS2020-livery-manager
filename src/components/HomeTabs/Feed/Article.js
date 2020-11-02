import React from 'react';
import PropTypes from 'prop-types';

import ArticleClass from '../../../models/Article';
import { Typography, makeStyles, Divider, Paper, Box } from '@material-ui/core';
import MarkdownRenderer from '../../MarkdownRenderer';
import LocaleContext from '../../../locales/LocaleContext';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 1000,
    margin: 'auto',
    '&:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
  title: {
    fontWeight: 600,
    paddingBottom: theme.spacing(),
  },
  article: {
    marginTop: theme.spacing(3),
    maxWidth: 720,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  bullet: {
    '&::after': {
      display: 'inline-block',
      transform: 'scale(1.25)',
      content: '"•"',
      paddingLeft: theme.spacing(0.75),
      paddingRight: theme.spacing(0.75),
    },
  },
}));

/**
 * Displays an Article instance nicely
 *
 * @export
 * @param {Object} props
 * @param {ArticleClass} props.article Article instance
 *
 * @return {React.ReactNode}
 */
export default function Article(props) {
  const CurrentLocale = React.useContext(LocaleContext);
  const { article } = props;

  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Box padding={3}>
        <Typography className={classes.title} variant="h5" component="h2">
          {article.title}
        </Typography>
        <Typography variant="caption" component="h3" gutterBottom color="textSecondary">
          {CurrentLocale.translate('manager.components.feed_article.authored_by', { author: article.author })}{' '}
          <span className={classes.bullet} /> {article.dateString}
        </Typography>
        <Divider />
        <article className={classes.article}>
          <MarkdownRenderer source={article.content} />
        </article>
      </Box>
    </Paper>
  );
}

Article.propTypes = {
  article: PropTypes.instanceOf(ArticleClass).isRequired,
};
