import React from 'react';

import { Chip, makeStyles, Tooltip } from '@material-ui/core';

import InstalledIcon from 'mdi-react/DownloadIcon';

const useStyles = makeStyles({ chip: { borderRadius: 4 } });

export default function InstalledBadge() {
  const classes = useStyles();

  return (
    <Tooltip title="To uninstall, update, or reinstall, head to the Installed Liveries tab.">
      <Chip className={classes.chip} size="small" label="Installed" color="primary" icon={<InstalledIcon />} />
    </Tooltip>
  );
}
