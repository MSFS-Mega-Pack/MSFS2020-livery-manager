import React from 'react';

import { Chip, makeStyles, Tooltip } from '@material-ui/core';

import AlertIcon from 'mdi-react/AlertDecagramOutlineIcon';

const useStyles = makeStyles({ chip: { borderRadius: 4 } });

export default function InstalledBadge() {
  const classes = useStyles();

  return (
    <Tooltip title="Go to 'Installed Liveries' to update this livery">
      <Chip className={classes.chip} size="small" label="Update available" color="primary" icon={<AlertIcon />} />
    </Tooltip>
  );
}
