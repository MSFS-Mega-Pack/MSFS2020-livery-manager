import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles, Typography } from '@material-ui/core';

/**
 * @param {Object} props
 * @param {string} props.fieldName Section title
 * @param {React.ReactNode} props.value Section value/description
 *
 * @return {React.ReactNode}
 */
export default function FieldValueDisplay(props) {
  const classes = makeStyles({
    sectTitle: { textTransform: 'uppercase', marginBottom: 2 },
  })();

  const { fieldName, value, titleProps, contentProps } = props;

  return (
    <Box>
      <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2" {...titleProps}>
        {fieldName}
      </Typography>
      <Typography variant="body2" gutterBottom component="div" {...contentProps}>
        {value}
      </Typography>
    </Box>
  );
}

FieldValueDisplay.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  titleProps: PropTypes.object,
  contentProps: PropTypes.object,
};
