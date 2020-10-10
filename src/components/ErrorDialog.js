import React from 'react';
import PropTypes from 'prop-types';

import { Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';

export default function ErrorDialog(props) {
  const { title, error, suggestions } = props;

  return (
    <Dialog open disableBackdropClick disableEscapeKeyDown>
      <DialogTitle style={{ paddingBottom: 4 }}>
        <Typography variant="h5">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" paragraph>
          Error
        </Typography>
        {error}
        {suggestions && (
          <>
            <Typography variant="h6" paragraph>
              Suggestions
            </Typography>
            {/* {suggestions} */}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

ErrorDialog.propTypes = {
  title: PropTypes.node.isRequired,
  error: PropTypes.node.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string),
};
