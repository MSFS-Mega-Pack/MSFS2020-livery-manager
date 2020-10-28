import React from 'react';
import PropTypes from 'prop-types';

import { Box, IconButton, makeStyles, Paper, Tooltip, Typography } from '@material-ui/core';
import RefreshIcon from 'mdi-react/RefreshIcon';
import dayjs from 'dayjs';
import LocaleContext from '../locales/LocaleContext';

const useStyles = makeStyles({
  root: { marginBottom: 16, marginTop: -8 },
  text: { lineHeight: '33px' },
});

export default function RefreshBox(props) {
  const { lastCheckedTime, justRefreshed, onRefresh, refreshInterval } = props;
  const classes = useStyles();
  const CurrentLocale = React.useContext(LocaleContext);

  let toolTipContent = CurrentLocale.translate('manager.components.refresh_box.refresh_button.tooltip.default');
  if (justRefreshed)
    toolTipContent = CurrentLocale.translate('manager.components.refresh_box.refresh_button.tooltip.default', {
      interval: refreshInterval / 1000,
    });

  return (
    <Paper className={classes.root} variant="outlined">
      <Box px={2} py={1} display="flex" flexDirection="row">
        <Typography color="textSecondary" variant="body2" className={classes.text}>
          <Tooltip title="When you last checked for installed and available liveries">
            <span>{CurrentLocale.translate('manager.components.refresh_box.refresh_button.last_refreshed')}</span>
          </Tooltip>{' '}
          {typeof lastCheckedTime === 'string'
            ? lastCheckedTime
            : dayjs(lastCheckedTime).format('D MMM YYYY, h:mm A') || CurrentLocale.translate('manager.components.refresh_box.unknown_time')}
        </Typography>
        <Box flex={1} />
        <Box>
          <Tooltip title={toolTipContent}>
            <span>
              <IconButton color="primary" size="small" disabled={!!justRefreshed} onClick={onRefresh}>
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
  refreshInterval: PropTypes.number.isRequired,
};
