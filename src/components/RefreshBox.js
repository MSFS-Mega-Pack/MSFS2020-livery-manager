import React from 'react';
import PropTypes from 'prop-types';

import { Box, IconButton, Paper, Tooltip, Typography } from '@material-ui/core';
import RefreshIcon from 'mdi-react/RefreshIcon';
import dayjs from 'dayjs';

export function RefreshBox(props) {
  const { lastCheckedTime, justRefreshed, onRefresh, disabled, refreshInterval } = props;

  let toolTipContent = 'Refresh available liveries';
  if (justRefreshed) toolTipContent = `Rate limiting is in effect: you need to wait at least ${refreshInterval / 1000}s between refreshes`;
  else if (disabled) toolTipContent = `You need to wait until your liveries are installed before refreshing.`;

  return (
    <Paper style={{ marginBottom: 16, marginTop: -8 }} variant="outlined">
      <Box px={2} py={1} display="flex" flexDirection="row">
        <Typography color="textSecondary" variant="body2" style={{ lineHeight: '33px' }}>
          Livery list last updated:{' '}
          {typeof lastCheckedTime === 'string' ? lastCheckedTime : dayjs(lastCheckedTime).format('D MMM YYYY, h:mm A') || 'unknown'}
        </Typography>
        <Box flex={1} />
        <Box>
          <Tooltip title={toolTipContent}>
            <span>
              <IconButton color="primary" size="small" disabled={!!justRefreshed || disabled} onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
}

RefreshBox.propTypes = {
  lastCheckedTime: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  justRefreshed: PropTypes.bool,
  onRefresh: PropTypes.func,
  disabled: PropTypes.bool,
  refreshInterval: PropTypes.number.isRequired,
};
