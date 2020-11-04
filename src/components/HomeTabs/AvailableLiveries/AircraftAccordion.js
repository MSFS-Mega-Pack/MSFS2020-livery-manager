import React from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, makeStyles, Typography } from '@material-ui/core';
import ExpandIcon from 'mdi-react/ExpandMoreIcon';
import CheckboxTickIcon from 'mdi-react/CheckboxMarkedOutlineIcon';
import CheckboxOffIcon from 'mdi-react/CheckboxBlankOffOutlineIcon';

import FieldValueDisplay from '../../FieldValueDisplay';
import LiveryList from './LiveryList';

import PlaneNameTable from '../../../data/PlaneNameTable.json';
import GetIndexOfLiveryInArray from '../../../helpers/GetIndexOfLiveryInArray';
import LocaleContext from '../../../locales/LocaleContext';

import NoImagePng from '../../../images/no-image-available.png';

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
    flexBasis: '25%',
    flex: '1',
  },
  accordion: {
    display: 'block',
    paddingLeft: 32,
    paddingRight: 32,
    flex: '1',
  },
  accordionContent: {
    marginBottom: theme.spacing(),
    display: 'flex',
  },
  aircraftThumbnail: {
    marginRight: theme.spacing(2),
    flexBasis: '33%',
    maxWidth: '100%',
    '& picture': {
      display: 'block',
      '& img': {
        objectFit: 'contain',
        display: 'block',
        height: '100%',
        width: '100%',
      },
    },
  },
  aircraftDetails: {
    flex: '1',
  },
  aircraftControls: {
    display: 'flex',
    marginTop: theme.spacing(),
    justifyContent: 'center',
  },
  dividerContainer: {
    margin: theme.spacing(3, 0),
  },
}));
export default function AircraftAccordion(props) {
  const { aircraft, sortedLiveries, AddSelectedLivery, RemoveSelectedLivery, disabled, installedLiveries, selectedLiveries } = props;
  const CurrentLocale = React.useContext(LocaleContext);

  const classes = useStyles();

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandIcon />}>
        <Typography className={classes.heading}>{PlaneNameTable[aircraft.name] || aircraft.name}</Typography>
        <Typography className={classes.secondaryHeading}>
          {CurrentLocale.translate('manager.pages.available_liveries.components.aircraft_accordion.available_count', {
            total: sortedLiveries.length,
          })}
        </Typography>
        <Typography className={classes.secondaryHeading}>
          {CurrentLocale.translate('manager.pages.available_liveries.components.aircraft_accordion.installed_count', {
            total: installedLiveries.filter(l => l.airplane.toLowerCase() === aircraft.name.toLowerCase()).length,
          })}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordion}>
        <Box className={classes.accordionContent}>
          <Box className={classes.aircraftThumbnail} component="figure">
            <picture>
              {aircraft.thumbnails && <source srcSet={aircraft.thumbnails[0]} />}
              <img
                src={NoImagePng}
                onError={function (e) {
                  if (e.currentTarget.parentNode.childElementCount > 1) e.currentTarget.previousSibling.remove();
                }}
              />
            </picture>
          </Box>
          <Box className={classes.aircraftDetails}>
            <FieldValueDisplay
              fieldName={CurrentLocale.translate(
                'manager.pages.available_liveries.components.aircraft_accordion.info_fields.aircraft_name.title'
              )}
              value={PlaneNameTable[aircraft.name] || aircraft.name}
            />
            <FieldValueDisplay
              fieldName={CurrentLocale.translate(
                'manager.pages.available_liveries.components.aircraft_accordion.info_fields.total_livery_count.title'
              )}
              value={CurrentLocale.translate(
                'manager.pages.available_liveries.components.aircraft_accordion.info_fields.total_livery_count.value',
                { total: sortedLiveries.length }
              )}
            />
            <FieldValueDisplay
              fieldName={CurrentLocale.translate(
                'manager.pages.available_liveries.components.aircraft_accordion.info_fields.total_installed_count.title'
              )}
              value={CurrentLocale.translate(
                'manager.pages.available_liveries.components.aircraft_accordion.info_fields.total_installed_count.value',
                { count: installedLiveries.length, total: sortedLiveries.length }
              )}
            />
            <Box className={classes.aircraftControls}>
              <Button
                disabled={disabled || selectedLiveries.length === sortedLiveries.length}
                variant="outlined"
                color="primary"
                onClick={() => {
                  AddSelectedLivery(sortedLiveries.filter(l => GetIndexOfLiveryInArray(l, installedLiveries)[0] === -1));
                }}
                startIcon={<CheckboxTickIcon />}
              >
                {CurrentLocale.translate('manager.pages.available_liveries.components.aircraft_accordion.buttons.select_all_btn')}
              </Button>
              <Box p={1} />
              <Button
                disabled={disabled || selectedLiveries.length === 0}
                variant="outlined"
                color="primary"
                onClick={() => RemoveSelectedLivery(sortedLiveries)}
                startIcon={<CheckboxOffIcon />}
              >
                {CurrentLocale.translate('manager.pages.available_liveries.components.aircraft_accordion.buttons.deselect_all_btn')}
              </Button>
            </Box>
          </Box>
        </Box>
        <Box className={classes.dividerContainer}>
          <Divider />
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom>
            {CurrentLocale.translate('manager.pages.available_liveries.components.aircraft_accordion.liveries_heading')}
          </Typography>
          <LiveryList
            disabled={disabled}
            liveries={sortedLiveries}
            AddSelectedLivery={AddSelectedLivery}
            RemoveSelectedLivery={RemoveSelectedLivery}
            installedLiveries={installedLiveries}
            selectedLiveries={selectedLiveries}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

AircraftAccordion.propTypes = {
  aircraft: PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnails: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  AddSelectedLivery: PropTypes.func.isRequired,
  RemoveSelectedLivery: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
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
    }).isRequired
  ).isRequired,
};
