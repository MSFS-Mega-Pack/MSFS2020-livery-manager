import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';

export default function ErrorDialog(props) {
  const { title, error, suggestions, dismissable } = props;
  const [shown, setShown] = useState(true);

  return (
    <Dialog
      open={shown}
      onClose={dismissable ? () => setShown(false) : null}
      disableBackdropClick={!dismissable}
      disableEscapeKeyDown={!dismissable}
    >
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
            <ul>
              {/* {suggestions} */}
              {suggestions.map((suggestion, i) => (
                <li key={`${i}__${suggestion}`}>{suggestion}</li>
              ))}
            </ul>
          </>
        )}
      </DialogContent>
      {dismissable && (
        <DialogActions>
          <Button onClick={() => setShown(false)}>Close</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

ErrorDialog.propTypes = {
  title: PropTypes.node.isRequired,
  error: PropTypes.node.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  dismissable: PropTypes.bool,
};
