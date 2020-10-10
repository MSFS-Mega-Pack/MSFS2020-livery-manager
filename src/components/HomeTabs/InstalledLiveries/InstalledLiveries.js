import React, { useState } from 'react';

import { Typography, Box } from '@material-ui/core';

import GetInstalledAddons from '../../../helpers/AddonInstaller/GetInstalledAddons';

export default function InstalledLiveries() {
  const [installedLiveries, setInstalledLiveries] = useState(undefined);

  if (typeof installedLiveries === 'undefined') {
    setInstalledLiveries(null);
    GetInstalledAddons()
      .then(livs => setInstalledLiveries(livs))
      .catch(e => setInstalledLiveries(e));
  }

  // console.log(installedLiveries);

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

      {/* {typeof installedLiveries === 'string' && (
        <ErrorDialog
          title={"Couldn't load available liveries"}
          error={
            <Typography variant="body2" paragraph>
              We couldn&apos;t fetch the list of installed liveries. Have you moved or deleted your Community folder?
            </Typography>
          }
          suggestions={[
            `The path you told us is "${Config.get(ConfigKeys.settings.package_directory)}". Is this correct?`,
            `Update your packages directory in Settings.`,
          ]}
        />
      )} */}

      <Box></Box>
    </div>
  );
}
