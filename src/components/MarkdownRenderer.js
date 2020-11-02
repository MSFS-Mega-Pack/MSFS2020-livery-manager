import React from 'react';

import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

import { Typography, Link, Tooltip, makeStyles } from '@material-ui/core';

/**
 * An implementation of `react-markdown` which converts supplied
 * Markdown code into Material UI components
 *
 * @export
 *
 * @param {Object} props
 * @param {String} props.source Markdown source
 *
 * @return {React.ReactNode}
 */
export default function MarkdownRenderer(props) {
  const { source } = props;

  const rendererStyles = makeStyles({
    h1: {
      fontSize: 26,
      fontWeight: 700,
    },
    h2: {
      fontSize: 24,
      fontWeight: 700,
    },
    h3: {
      fontSize: 20,
      fontWeight: 400,
    },
  })();

  //! For renderer and prop lists, see this page:
  //! https://github.com/rexxars/commonmark-react-renderer#type-renderer-options
  //!
  //! We need to provide function names to prevent
  //! the ESLint issue 'react/display-name'

  /* eslint-disable react/prop-types */
  const renderers = {
    paragraph: function ParagraphRenderer(props) {
      return <Typography paragraph variant="body2" component="p" {...props} />;
    },
    heading: function HeadingRenderer(props) {
      return (
        <Typography
          gutterBottom
          variant={`h${props.level}`}
          component={`h${props.level}`}
          className={rendererStyles[`h${props.level}`]}
          {...props}
        />
      );
    },
    link: function LinkRenderer(props) {
      if (props.title) {
        return (
          <Tooltip title={props.title}>
            <Link color="primary" target="_blank" href={props.href}>
              {props.children}
            </Link>
          </Tooltip>
        );
      } else {
        return (
          <Link color="primary" target="_blank" href={props.href}>
            {props.children}
          </Link>
        );
      }
    },
  };
  /* eslint-enable react/prop-types */

  return <ReactMarkdown renderers={renderers} source={source} />;
}

MarkdownRenderer.propTypes = {
  source: PropTypes.string.isRequired,
};
