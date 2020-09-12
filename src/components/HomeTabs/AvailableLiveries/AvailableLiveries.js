import React from 'react';

import { Box, Button, CircularProgress, Paper, Typography } from '@material-ui/core';
import FullTable from './FullTable';

import dayjs from 'dayjs';
import FetchAndParseManifest from '../../../helpers/Manifest/FetchAndParseManifest';

import ActiveApiEndpoint from '../../../data/ActiveApiEndpoint';
import Constants from '../../../data/Constants.json';
import PlaneNameTable from '../../../data/PlaneNameTable.json';

export default function AvailableLiveries(props) {
  const { fileListing, setFileListing } = props;
  let aircraft = [],
    sortedLiveries = {};

  function UpdateFileList() {
    FetchAndParseManifest(`${ActiveApiEndpoint}/${Constants.api.get.cdnFileListing}`)
      .then(d => setFileListing({ checkedAt: new Date().getTime(), ...d }))
      .catch(() => setFileListing(null));
  }

  if (typeof fileListing === 'undefined') {
    UpdateFileList();

    return (
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
        <CircularProgress size={48} />
      </div>
    );
  } else if (fileListing && fileListing.data && fileListing.data.fileList) {
    // Create array of all aircraft with liveries, along with a thumbnail image
    const m = new Map();
    for (const item of fileListing.data.fileList) {
      if (!m.has(item.airplane)) {
        m.set(item.airplane, true);

        let thumb = fileListing.data.fileList.filter(a => a.airplane.toLowerCase() === item.airplane.toLowerCase()).find(a => a.image);
        thumb = thumb.image;

        aircraft.push({
          name: item.airplane.toLowerCase(),
          thumbnail: `${fileListing.data.cdnBaseUrl}/${thumb}`,
        });
      }
    }

    aircraft = aircraft.sort((a, b) =>
      (PlaneNameTable[a.name] || a.name).toLowerCase().localeCompare((PlaneNameTable[b.name] || b.name).toLowerCase())
    );

    let temp = {};

    aircraft.forEach(a => {
      temp[a.name] = [];
    });

    fileListing.data.fileList.forEach(livery => {
      temp[livery.airplane.toLowerCase()].push(livery);
    });

    for (const key in temp) {
      if (Object.prototype.hasOwnProperty.call(temp, key)) {
        /** @type {object[]} */
        const liverySet = temp[key];

        temp[key] = liverySet.sort((a, b) => a.fileName.toLowerCase().localeCompare(b.fileName.toLowerCase()));
      }
    }

    sortedLiveries = temp;
  }

  return (
    <div>
      <Paper style={{ marginBottom: 16 }}>
        <Box p={2} display="flex" flexDirection="row">
          <Typography color="textSecondary" variant="body2" style={{ lineHeight: '33px' }}>
            Last updated: {dayjs(fileListing.checkedAt).format('D MMM YYYY, h:mm A') || 'unknown'}
          </Typography>
          <Box flex={1} />
          <Box>
            <Button>Refresh</Button>
          </Box>
        </Box>
      </Paper>
      {fileListing && <FullTable sortedLiveries={sortedLiveries} allAircraft={aircraft} />}
    </div>
  );
}
