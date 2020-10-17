import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Link, Typography } from '@material-ui/core';

import AircraftAccordion from './AircraftAccordion';

import PlaneNameTable from '../../../data/PlaneNameTable.json';

export default function FullInstalledTable(props) {
  const { liveries, allAircraft, liveryData, AddLiveryToData, RemoveLiveryFromData, expandedList, SetExpanded } = props;

  // if there are no aircraft...
  if (!liveries || liveries.length === 0 || !allAircraft || allAircraft.length === 0) {
    return (
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 'max-content', transform: 'translate(-50%,-50%)' }}>
        <Typography variant="h5" component="p">
          No installed liveries detected.
        </Typography>
        <Typography variant="caption" component="p" style={{ position: 'absolute', bottom: -24, right: 0, cursor: 'pointer' }}>
          <Link
            onClick={() => {
              alert(
                "We couldn't find any mega pack liveries in your selected Community folder.\n\nIf you installed liveries through the mega pack zip, they will not appear here. They must be installed via the manager."
              );
            }}
          >
            More info
          </Link>
        </Typography>
      </div>
    );
  }

  // Sort list of installed liveries by display names
  allAircraft.sort((a, b) =>
    (PlaneNameTable[a.name] || a.name) > (PlaneNameTable[b.name] || b.name)
      ? 1
      : (PlaneNameTable[a.name] || a.name) < (PlaneNameTable[b.name] || b.name)
      ? -1
      : 0
  );

  return (
    <Box>
      {allAircraft.map(ac => {
        return (
          <AircraftAccordion
            expanded={expandedList.includes(ac.name)}
            setExpanded={isExpanded => SetExpanded(ac.name, isExpanded)}
            disabled={false}
            key={ac.name}
            aircraft={ac}
            AddLiveryToData={AddLiveryToData}
            RemoveLiveryFromData={RemoveLiveryFromData}
            liveryData={{
              disabled: liveryData.disabled.filter(l => l.airplane.toLowerCase() === ac.name.toLowerCase()),
              deleting: liveryData.deleting.filter(l => l.airplane.toLowerCase() === ac.name.toLowerCase()),
              updating: liveryData.updating.filter(l => l.airplane.toLowerCase() === ac.name.toLowerCase()),
              selected: liveryData.selected.filter(l => l.airplane.toLowerCase() === ac.name.toLowerCase()),
              RefreshInstalledLiveries: liveryData.RefreshInstalledLiveries,
            }}
            installedLiveries={liveries
              .filter(o => o.airplane.toLowerCase() === ac.name.toLowerCase())
              .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))}
          />
        );
      })}
    </Box>
  );
}

const CustomPropTypes = {
  Livery: PropTypes.shape({
    airplane: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    generation: PropTypes.string.isRequired,
    metaGeneration: PropTypes.string.isRequired,
    lastModified: PropTypes.string.isRequired,
    ETag: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    checkSum: PropTypes.string.isRequired,
    image: PropTypes.string,
    smallImage: PropTypes.string,
  }),
  Aircraft: PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
  }),
};

FullInstalledTable.propTypes = {
  liveryData: PropTypes.shape({
    disabled: PropTypes.arrayOf(CustomPropTypes.Livery),
    deleting: PropTypes.arrayOf(CustomPropTypes.Livery),
    updating: PropTypes.arrayOf(CustomPropTypes.Livery),
    selected: PropTypes.arrayOf(CustomPropTypes.Livery),
    RefreshInstalledLiveries: PropTypes.func.isRequired,
  }),
  allAircraft: PropTypes.arrayOf(CustomPropTypes.Aircraft),
  liveries: PropTypes.arrayOf(CustomPropTypes.Livery),
  AddLiveryToData: PropTypes.func,
  RemoveLiveryFromData: PropTypes.func,
  SetExpanded: PropTypes.func.isRequired,
  expandedList: PropTypes.arrayOf(PropTypes.string).isRequired,
};
