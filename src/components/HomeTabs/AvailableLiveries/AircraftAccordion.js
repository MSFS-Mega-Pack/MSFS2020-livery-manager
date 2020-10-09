import React from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, makeStyles, Typography } from '@material-ui/core';
import ExpandIcon from 'mdi-react/ExpandMoreIcon';
import CheckboxTickIcon from 'mdi-react/CheckboxMarkedOutlineIcon';
import CheckboxOffIcon from 'mdi-react/CheckboxBlankOffOutlineIcon';

import FieldValueDisplay from './FieldValueDisplay';
import LiveryList from './LiveryList';

import PlaneNameTable from '../../../data/PlaneNameTable.json';

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    lineHeight: '30px',
    flexBasis: '50%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(13),
    lineHeight: '30px',
    color: theme.palette.text.secondary,
  },
}));
export default function AircraftAccordion(props) {
  const { aircraft, sortedLiveries, GetIndexOfObjectInArray, AddSelectedLivery, RemoveSelectedLivery, disabled, installedLiveries } = props;
  const classes = useStyles();

  function isLiveryInstalled(name) {
    if(installedLiveries) {
      installedLiveries.forEach(livery => {
        if(livery.airplane === name) {
          return true;
        }
      });
      return false;
    }
  }

  function GetLiveriesNotInstalled(item, installedLiveries) {
    if(!isLiveryInstalled(item.airplane)) {
      return GetIndexOfObjectInArray(item, installedLiveries) === -1;
    }
    console.log(2);
    return false;
  }
  

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        <Typography className={classes.heading}>{PlaneNameTable[aircraft.name] || aircraft.name}</Typography>
        <Typography className={classes.secondaryHeading}>{sortedLiveries.length} liveries available</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ display: 'block', paddingLeft: 32, paddingRight: 32 }}>
        <Box display="flex" mb={1}>
          <Box component="figure" mr={2}>
            <img style={{ display: 'block', maxWidth: 350, objectFit: 'contain' }} src={aircraft.thumbnail} alt="No image available" />
          </Box>
          <Box flex={1}>
            <FieldValueDisplay fieldName="Aircraft" value={PlaneNameTable[aircraft.name] || aircraft.name} />
            <FieldValueDisplay fieldName="Total liveries" value={`${sortedLiveries.length} available`} />
            <FieldValueDisplay
              fieldName="Total liveries installed"
              value={`${installedLiveries.length} of ${sortedLiveries.length} installed`}
            />
            <Box mt={1} display="flex" justifyContent="center">
              <Button
                disabled={disabled}
                variant="outlined"
                color="primary"
                onClick={() => AddSelectedLivery(sortedLiveries.filter(l =>GetLiveriesNotInstalled(l, installedLiveries)))}
                startIcon={<CheckboxTickIcon />}
              >
                Select all
              </Button>
              <Box p={1} />
              <Button
                disabled={disabled}
                variant="outlined"
                color="primary"
                onClick={() => RemoveSelectedLivery(sortedLiveries)}
                startIcon={<CheckboxOffIcon />}
              >
                Deselect all
              </Button>
            </Box>
          </Box>
        </Box>
        <Box mt={3} mb={3}>
          <Divider />
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            Liveries
          </Typography>
          <LiveryList
            disabled={disabled}
            liveries={sortedLiveries}
            GetIndexOfObjectInArray={GetIndexOfObjectInArray}
            AddSelectedLivery={AddSelectedLivery}
            RemoveSelectedLivery={RemoveSelectedLivery}
            installedLiveries={installedLiveries}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

AircraftAccordion.propTypes = {
  aircraft: PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
  }).isRequired,
  sortedLiveries: PropTypes.arrayOf(
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
  GetIndexOfObjectInArray: PropTypes.func.isRequired,
  AddSelectedLivery: PropTypes.func.isRequired,
  RemoveSelectedLivery: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
