import React from 'react';
import PropTypes from 'prop-types';

import { Accordion, AccordionSummary, Box, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';

import ExpandIcon from 'mdi-react/ExpandMoreIcon';
import ThumbnailIcon from 'mdi-react/ImageOutlineIcon';

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
                <Box flex={1} />
                {ac.thumbnail && (
                  <Tooltip
                    PopperProps={{
                      keepMounted: true,
                      modifiers: { preventOverflow: { enabled: true, boundariesElement: 'viewport' } },
                      style: { width: 350, height: 180 },
                    }}
                    placement="left"
                    title={<img src={ac.thumbnail} style={{ display: 'block', objectFit: 'contain', width: '100%' }} />}
                  >
                    <span>
                      <IconButton size="small">
                        <ThumbnailIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </AccordionSummary>
            </Accordion>
          );
        })}
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
};
