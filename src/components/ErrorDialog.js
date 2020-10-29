import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import LocaleContext from '../locales/LocaleContext';

export default function ErrorDialog(props) {
  const { title, error, suggestions, dismissable } = props;
  const [shown, setShown] = useState(true);
  const CurrentLocale = React.useContext(LocaleContext);

  return (
    <Dialog
      open={shown}
      onClose={dismissable ? () => setShown(false) : null}
      disableBackdropClick={!dismissable}
      disableEscapeKeyDown={!dismissable}
    >
      <DialogTitle style={{ paddingBottom: 4 }}>
        <Typography variant="h5" component="span">
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6" paragraph>
          {CurrentLocale.translate('manager.components.error_dialog.error')}
        </Typography>
        {error}
        {suggestions && (
          <>
            <Typography variant="h6" paragraph>
              {CurrentLocale.translate('manager.components.error_dialog.suggestions')}
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
          <Button onClick={() => setShown(false)}>{CurrentLocale.translate('manager.components.error_dialog.close_dialog_button')}</Button>
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
