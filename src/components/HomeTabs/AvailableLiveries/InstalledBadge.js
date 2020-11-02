import React from 'react';

import { Chip, makeStyles, Tooltip } from '@material-ui/core';
import InstalledIcon from 'mdi-react/DownloadIcon';

import LocaleContext from '../../../locales/LocaleContext';

const useStyles = makeStyles({ chip: { borderRadius: 4 } });

export default function InstalledBadge() {
  const classes = useStyles();
  const CurrentLocale = React.useContext(LocaleContext);

  return (
    <Tooltip title={CurrentLocale.translate('manager.components.badges.installed.tooltip')}>
      <Chip
        className={classes.chip}
        size="small"
        label={CurrentLocale.translate('manager.components.badges.installed.content')}
        color="primary"
        icon={<InstalledIcon />}
      />
    </Tooltip>
  );
}
