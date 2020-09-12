import React from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, makeStyles, Typography } from '@material-ui/core';

import ExpandIcon from 'mdi-react/ExpandMoreIcon';

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

/**
 * Displays a table of all aircraft and their liveries
 *
 * @export
 * @param {{liveries: object}} props
 * @return {React.ReactNode}
 */
export default function FullTable(props) {
  const { sortedLiveries, allAircraft } = props;
  const classes = useStyles();

  return (
    <Box>
      <Typography gutterBottom variant="h5">
        All aircraft
      </Typography>
      <Typography paragraph variant="body2">
        Click any aircraft to see its available liveries. Select the liveries you want, then click Install.
      </Typography>

      <Box>
        {allAircraft.map(ac => {
          return (
            <Accordion key={ac.name}>
              <AccordionSummary expandIcon={<ExpandIcon />}>
                <Typography className={classes.heading}>{PlaneNameTable[ac.name] || ac.name}</Typography>
                <Typography className={classes.secondaryHeading}>{sortedLiveries[ac.name].length} liveries available</Typography>
              </AccordionSummary>
              <AccordionDetails style={{ display: 'block', paddingLeft: 32, paddingRight: 32 }}>
                <Box display="flex" mb={1}>
                  <Box component="figure" mr={2}>
                    <img style={{ display: 'block', maxWidth: 350, objectFit: 'contain' }} src={ac.thumbnail} alt="No image available" />
                  </Box>
                  <Box flex={1}>
                    <FieldValueDisplay fieldName="Aircraft" value={PlaneNameTable[ac.name] || ac.name} />
                    <FieldValueDisplay fieldName="Total liveries" value={`${sortedLiveries[ac.name].length} available`} />
                  </Box>
                </Box>
                <Box mt={3} mb={3}>
                  <Divider />
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Liveries
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
}

/**
 * @param {Object} props
 * @param {string} props.fieldName Section title
 * @param {React.ReactNode} props.value Section value/description
 *
 * @return {React.ReactNode}
 */
function FieldValueDisplay(props) {
  const classes = makeStyles({
    sectTitle: { textTransform: 'uppercase', marginBottom: 2 },
  })();

  const { fieldName, value } = props;

  return (
    <>
      <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2">
        {fieldName}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        {value}
      </Typography>
    </>
  );
}

FieldValueDisplay.propTypes = {
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
};

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
};
