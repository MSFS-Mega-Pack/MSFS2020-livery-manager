import React from 'react';
import PropTypes from 'prop-types';

import { Box, Link, Typography } from '@material-ui/core';

import AircraftAccordion from './AircraftAccordion';
import GetIndexOfLiveryInArray from '../../../helpers/GetIndexOfLiveryInArray';

/**
 * Displays a table of all aircraft and their liveries
 *
 * @export
 * @param {{liveries: object}} props
 * @return {React.ReactNode}
 */
export default function FullInstalledTable(props) {
  const { sortedLiveries, allAircraft, disabled, installedLiveries, selectedLiveries } = props;

  console.log(allAircraft);
  console.log(sortedLiveries);

  // if there are no aircraft...
  if (!allAircraft || !sortedLiveries) {
    return (
      
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 'max-content', transform: 'translate(-50%,-50%)' }}>
        <Typography variant="h5" component="p">
          No installed liveries detected.
        </Typography>
        <Typography variant="caption" component="p" style={{ position: 'absolute', bottom: -24, right: 0, cursor: 'pointer' }}>
          <Link
            onClick={() => {
              alert("We couldn't find any mega pack liveries in your selected Community folder.\n\nIf you installed liveries through the mega pack zip, they will not appear here. They must be installed via the manager.");
            }}
          >
            More info
          </Link>
        </Typography>
      </div>
    );
  }

  return (
    <Box>
      {allAircraft.map(ac => {
        if (Object.keys(sortedLiveries).includes(ac.name)) {
          return (
            <AircraftAccordion
              disabled={disabled}
              key={ac.name}
              aircraft={ac}
              sortedLiveries={sortedLiveries[ac.name]}
              installedLiveries={installedLiveries.filter(o => o.airplane.toLowerCase() === ac.name.toLowerCase())}
              selectedLiveries={selectedLiveries}
            />
          );
        } else {
          return null;
        }
      })}
    </Box>
  );
}

FullInstalledTable.propTypes = {
  sortedLiveries: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
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
      })
    )
  ),
  installedLiveries: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ),
  allAircraft: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, thumbnail: PropTypes.string })),
  selectedLiveries: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ),
  setSelectedLiveries: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

FullInstalledTable.defaultProps = {
  disabled: false,
  setSelectedLiveries: () => {},
};
