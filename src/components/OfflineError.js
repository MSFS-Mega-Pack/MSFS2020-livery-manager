import React, { useEffect, useState } from 'react';

import { Dialog, DialogContent, DialogTitle, Typography } from '@material-ui/core';

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

  if (!isOnline) {
    return (
      <Dialog open disableBackdropClick disableEscapeKeyDown>
        <DialogTitle style={{ paddingBottom: 4 }}>
          <Typography variant="h5" component="span">
            You&apos;re offline
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            This app needs an internet connection to function. Double check your network.
          </Typography>
          <Typography variant="body2" paragraph>
            This message will automatically dismiss when you regain connection.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  } else {
    return null;
  }
}
