import React from 'react';
import PropTypes from 'prop-types';

import { Box, IconButton, makeStyles, Paper, Tooltip, Typography } from '@material-ui/core';
import RefreshIcon from 'mdi-react/RefreshIcon';
import dayjs from 'dayjs';

const useStyles = makeStyles({
  root: { marginBottom: 16, marginTop: -8 },
  text: { lineHeight: '33px' },
});

export function RefreshBox(props) {
  const { lastCheckedTime, justRefreshed, onRefresh, disabled, refreshInterval } = props;
  const classes = useStyles();

  let toolTipContent = 'Refresh available liveries';
  if (justRefreshed) toolTipContent = `Rate limiting is in effect: you need to wait at least ${refreshInterval / 1000}s between refreshes`;
  else if (disabled) toolTipContent = `You need to wait until your liveries are installed before refreshing.`;

  return (
    <Paper className={classes.root} variant="outlined">
      <Box px={2} py={1} display="flex" flexDirection="row">
        <Typography color="textSecondary" variant="body2" className={classes.text}>
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
