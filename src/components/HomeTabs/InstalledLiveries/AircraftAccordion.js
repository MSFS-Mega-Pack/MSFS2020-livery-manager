import React from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionDetails, AccordionSummary, Box, makeStyles, Typography } from '@material-ui/core';
import ExpandIcon from 'mdi-react/ExpandMoreIcon';

import LiveryList from './LiveryList';

import fs from 'fs';
import { useSnackbar } from 'notistack';

import PlaneNameTable from '../../../data/PlaneNameTable.json';

import GetIndexOfLiveryInArray from '../../../helpers/GetIndexOfLiveryInArray';
import DeleteAddon from '../../../helpers/AddonInstaller/deleteAddon';
import LocaleContext from '../../../locales/LocaleContext';

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
  const { aircraft, installedLiveries, AddLiveryToData, RemoveLiveryFromData, liveryData, expanded, setExpanded, fileListing } = props;

  const classes = useStyles();
  const liveriesForThisAircraft = installedLiveries
    ? installedLiveries.filter(l => l.airplane.toLowerCase() === aircraft.name.toLowerCase())
    : [];
  const liveriesWithUpdatesAvailable = liveriesForThisAircraft.filter(
    l => GetIndexOfLiveryInArray(l, fileListing.data.fileList)[1] === 'differentHash'
  );

  const { enqueueSnackbar } = useSnackbar();
  const CurrentLocale = React.useContext(LocaleContext);

  return (
    <Accordion
      expanded={expanded}
      onChange={(e, isExpanded) => {
        setExpanded(isExpanded);
      }}
      TransitionProps={{ unmountOnExit: true }}
    >
      <AccordionSummary expandIcon={<ExpandIcon />}>
        <Typography className={classes.heading}>{PlaneNameTable[aircraft.name] || aircraft.name}</Typography>
        <Typography className={classes.secondaryHeading}>
          {CurrentLocale.translate('manager.pages.installed_liveries.components.aircraft_accordion.installed_count', {
            total: liveriesForThisAircraft.length,
          })}
        </Typography>
        <Typography className={classes.secondaryHeading}>
          {CurrentLocale.translate('manager.pages.installed_liveries.components.aircraft_accordion.update_count', {
            updates: liveriesWithUpdatesAvailable.length,
          })}
        </Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordion}>
        <Box>
          <Typography variant="h6" gutterBottom>
            {CurrentLocale.translate('manager.pages.installed_liveries.components.aircraft_accordion.liveries_heading')}
          </Typography>
          <LiveryList
            installedLiveries={installedLiveries}
            liveryData={liveryData}
            fileListing={fileListing}
            deleteLivery={async livery => {
              console.log('start deletion');

              if (!livery) {
                // No livery object passed
                enqueueSnackbar(CurrentLocale.translate('manager.pages.installed_liveries.notification.deletion.fail1'), { variant: 'error' });
                return;
              }

              console.log('a');
              AddLiveryToData('deleting', livery);
              console.log('b');

              if (!livery.installLocation) {
                // No install location passed
                enqueueSnackbar(CurrentLocale.translate('manager.pages.installed_liveries.notification.deletion.fail2'), { variant: 'error' });
                RemoveLiveryFromData('deleting', livery);
                return;
              }
              console.log('c');

              const liveryPath = livery.installLocation;
              console.log(liveryPath);

              if (!fs.existsSync(liveryPath)) {
                // Install path doesn't exist
                enqueueSnackbar(CurrentLocale.translate('manager.pages.installed_liveries.notification.deletion.fail3'), { variant: 'error' });
                RemoveLiveryFromData('deleting', livery);
                return;
              }
              console.log('d');

              try {
                const result = await DeleteAddon(liveryPath, CurrentLocale);

                console.log(result);
                console.log('f');
                liveryData.RefreshInstalledLiveries();
                console.log('g');

                if (result[0] === false) {
                  // Other error
                  enqueueSnackbar(
                    CurrentLocale.translate('manager.pages.installed_liveries.notification.deletion.fail4', { error: result[1] }),
                    { variant: 'error' }
                  );
                  RemoveLiveryFromData('deleting', livery);
                  console.error(result[1]);
                } else {
                  enqueueSnackbar(CurrentLocale.translate('manager.pages.installed_liveries.notification.deletion.success'), {
                    variant: 'success',
                  });
                }
              } catch (err) {
                // Other error
                enqueueSnackbar(CurrentLocale.translate('manager.pages.installed_liveries.notification.deletion.fail5'), { variant: 'error' });
                RemoveLiveryFromData('deleting', livery);
                console.error(err);
                return;
              }
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
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
};

AircraftAccordion.propTypes = {
  aircraft: PropTypes.shape({
    name: PropTypes.string.isRequired,
    thumbnails: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  installedLiveries: PropTypes.arrayOf(CustomPropTypes.Livery),
  AddLiveryToData: PropTypes.func,
  RemoveLiveryFromData: PropTypes.func,
  liveryData: PropTypes.shape({
    disabled: PropTypes.arrayOf(CustomPropTypes.Livery),
    deleting: PropTypes.arrayOf(CustomPropTypes.Livery),
    updating: PropTypes.arrayOf(CustomPropTypes.Livery),
    selected: PropTypes.arrayOf(CustomPropTypes.Livery),
    RefreshInstalledLiveries: PropTypes.func,
  }),
  expanded: PropTypes.bool.isRequired,
  setExpanded: PropTypes.func.isRequired,
  fileListing: PropTypes.shape({ data: { fileList: PropTypes.arrayOf(CustomPropTypes.Livery) } }),
};
