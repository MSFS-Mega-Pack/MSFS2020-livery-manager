import React, { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import LocaleContext from '../locales/LocaleContext';

export default function OfflineError() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goneOnline = function () {
      setIsOnline(true);
    };
    const goneOffline = function () {
      setIsOnline(false);
    };

    window.addEventListener('online', goneOnline);
    window.addEventListener('offline', goneOffline);

    return () => {
      window.removeEventListener('online', goneOnline);
      window.removeEventListener('offline', goneOffline);
    };
  }, [setIsOnline]);

  const CurrentLocale = React.useContext(LocaleContext);

  if (!isOnline) {
    return (
      <Dialog open disableBackdropClick disableEscapeKeyDown>
        <DialogTitle style={{ paddingBottom: 4 }}>
          <Typography variant="h5" component="span">
            {CurrentLocale.translate('manager.components.offline_error.title')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            {CurrentLocale.translate('manager.components.offline_error.paragraph1')}
          </Typography>
          <Typography variant="body2" paragraph>
            {CurrentLocale.translate('manager.components.offline_error.paragraph2')}
          </Typography>
        </DialogContent>
      </Dialog>
    );
  } else {
    return null;
  }
}
