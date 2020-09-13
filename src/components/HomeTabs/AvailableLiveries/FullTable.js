import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Typography } from '@material-ui/core';

import AircraftAccordion from './AircraftAccordion';

/**
 * Displays a table of all aircraft and their liveries
 *
 * @export
 * @param {{liveries: object}} props
 * @return {React.ReactNode}
 */
export default function FullTable(props) {
  const { sortedLiveries, allAircraft, selectedLiveriesUpdated } = props;

  const [selectedLiveries, setSelectedLiveries] = useState([]);

  /**
   * Checks if an object is in the selected livs array. This only works with objects only containing JSON types.
   *
   * @param {object} obj
   * @return {boolean}
   */
  function GetIndexOfObjectInArray(obj, arr = selectedLiveries) {
    return arr.findIndex(o => JSON.stringify(o) === JSON.stringify(obj));
  }

  function AddSelectedLivery(liv) {
    if (Array.isArray(liv)) {
      setSelectedLiveries(selectedLiveries => {
        let x = [...selectedLiveries];

        liv.forEach(l => {
          if (GetIndexOfObjectInArray(l, selectedLiveries) === -1) {
            x.push(l);
          }
        });

        selectedLiveriesUpdated(x);
        return x;
      });
    } else {
      setSelectedLiveries(selectedLiveries => {
        if (GetIndexOfObjectInArray(liv, selectedLiveries) === -1) {
          let x = [...selectedLiveries, liv];
          selectedLiveriesUpdated(x);
          return x;
        }
        return selectedLiveries;
      });
    }
  }

  function RemoveSelectedLivery(liv) {
    const index = GetIndexOfObjectInArray(liv);
    if (index !== -1) {
      setSelectedLiveries(selectedLiveries => {
        let x = [...selectedLiveries, liv];
        x.splice(index, 1);
        selectedLiveriesUpdated(x);
        return x;
      });
    }
  }

  return (
    <Box>
      <Typography gutterBottom variant="h5">
        All aircraft
      </Typography>
      <Typography paragraph variant="body2">
        Click any aircraft to see its available liveries. Select the liveries you want, then click Install.
      </Typography>

      <Box>
        {allAircraft.map(ac => (
          <AircraftAccordion
            key={ac.name}
            aircraft={ac}
            sortedLiveries={sortedLiveries}
            GetIndexOfObjectInArray={GetIndexOfObjectInArray}
            AddSelectedLivery={AddSelectedLivery}
            RemoveSelectedLivery={RemoveSelectedLivery}
          />
        ))}
      </Box>
    </Box>
  );
}

FullTable.propTypes = {
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
  allAircraft: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, thumbnail: PropTypes.string })),
  selectedLiveriesUpdated: PropTypes.func.isRequired,
};

FullTable.defaultProps = {
  selectedLiveriesUpdated: () => {},
};
