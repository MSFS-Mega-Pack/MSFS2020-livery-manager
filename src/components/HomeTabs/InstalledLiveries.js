import React, { useState } from 'react';

import { Typography, Box, Paper } from '@material-ui/core';
import GetInstalledAddons from '../../helpers/AddonInstaller/GetInstalledAddons';

export default function InstalledLiveries() {
  const [installedLiveries, setInstalledLiveries] = useState(undefined);

  if (typeof installedLiveries === 'undefined') {
    setInstalledLiveries(null);
    GetInstalledAddons().then(livs => setInstalledLiveries(livs));
  }

  console.log(installedLiveries);
  
  return (
    <div>
      <Box>
        <Typography gutterBottom variant="h5">
          All aircraft
        </Typography>
        <Typography paragraph variant="body2">
          Click any aircraft to see its available liveries. Select the liveries you want, then click Install.
        </Typography>
      </Box>

      <Box>
      </Box>
    </div>
  );
}
