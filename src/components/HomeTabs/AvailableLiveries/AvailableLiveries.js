import React, { useState } from 'react';

import { Typography } from '@material-ui/core';

export default function AvailableLiveries() {
  const [availableLiveries, setAvailableLiveries] = useState(null);

  return (
    <div>
      <Typography paragraph>This is the Available Liveries page.</Typography>
    </div>
  );
}
