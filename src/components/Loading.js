import { CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

export default function Loading() {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
      <CircularProgress style={{ margin: 'auto', marginBottom: 24 }} size={64} />
      <Typography variant="body1" style={{ paddingBottom: 2 }}>
        Loading...
      </Typography>
      <Typography variant="body2" color="textSecondary">
        This can take up to a minute
      </Typography>
    </div>
  );
}
