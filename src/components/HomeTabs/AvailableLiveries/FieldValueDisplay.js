import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';

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

  const { fieldName, value } = props;

  return (
    <>
      <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2">
        {fieldName}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        {value}
      </Typography>
    </>
  );
}

FieldValueDisplay.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
};
