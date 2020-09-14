import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Virtuoso } from 'react-virtuoso';
import { Box, Checkbox, Collapse, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';

import ExpandIcon from 'mdi-react/ExpandMoreIcon';

import FieldValueDisplay from './FieldValueDisplay';
import Constants from '../../../data/Constants.json';

export default function LiveryList(props) {
  const { liveries, GetIndexOfObjectInArray, AddSelectedLivery, RemoveSelectedLivery } = props;

  return (
    <List dense>
      <Virtuoso
        totalCount={liveries.length}
        style={{ height: 350 }}
        item={i => {
          const liv = liveries[i];

          return (
            <ListRow
              key={`${liv.fileName}__${liv.checkSum}`}
              livery={liv}
              GetIndexOfObjectInArray={GetIndexOfObjectInArray}
              AddSelectedLivery={AddSelectedLivery}
              RemoveSelectedLivery={RemoveSelectedLivery}
            />
          );
        }}
      />
    </List>
  );
}

function ListRow(props) {
  const { livery, GetIndexOfObjectInArray, AddSelectedLivery, RemoveSelectedLivery } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const Checked = GetIndexOfObjectInArray(livery) !== -1;

  async function ToggleCheckbox(e) {
    e.stopPropagation();

    console.log(Checked);

    if (!Checked) {
      GetIndexOfObjectInArray(livery) === -1 && AddSelectedLivery(livery);
    } else {
      GetIndexOfObjectInArray(livery) !== -1 && RemoveSelectedLivery(livery);
    }
  }

  console.log(livery);

  return (
    <>
      <ListItem button disableRipple onClick={ToggleCheckbox}>
        <ListItemIcon>
          <Checkbox color="primary" edge="start" checked={Checked} onChange={ToggleCheckbox} />
        </ListItemIcon>
        <ListItemText primary={livery.fileName.substr(livery.fileName.indexOf('/') + 1).split('.zip')[0]} />
        <Tooltip title={!isExpanded ? 'Show livery info' : 'Hide livery info'}>
          <IconButton
            centerRipple
            onClick={e => {
              e.stopPropagation();
              setIsExpanded(e => !e);
            }}
          >
            <ExpandIcon style={{ transform: isExpanded ? 'rotate(180deg)' : null, transition: 'transform 200ms ease-out' }} />
          </IconButton>
        </Tooltip>
      </ListItem>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box p={2}>
          <FieldValueDisplay
            fieldName="Version"
            value={
              <Tooltip title="The version is a single unique string that represents the contents of all files in the livery">
                <span style={{ borderBottom: '#aaaa dotted 2px', cursor: 'help' }}>{livery.checkSum.substr(0, 8)}</span>
              </Tooltip>
            }
          />
          <FieldValueDisplay
            fieldName="Version"
            value={
              <Box component="figure" p={1}>
                <img
                  style={{ display: 'block', maxWidth: 350, objectFit: 'contain', margin: 'auto' }}
                  src={`${Constants.urls.cdnEndpoint}/${livery.image}` || `${Constants.urls.cdnEndpoint}/${livery.smallImage}`}
                  alt="No image available"
                />
              </Box>
            }
          />
        </Box>

        <Divider />
      </Collapse>
    </>
  );
}

LiveryList.propTypes = {
  liveries: PropTypes.arrayOf(
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
  GetIndexOfObjectInArray: PropTypes.func.isRequired,
  AddSelectedLivery: PropTypes.func.isRequired,
  RemoveSelectedLivery: PropTypes.func.isRequired,
};

ListRow.propTypes = {
  livery: PropTypes.shape({
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
  }).isRequired,
  GetIndexOfObjectInArray: PropTypes.func.isRequired,
  AddSelectedLivery: PropTypes.func.isRequired,
  RemoveSelectedLivery: PropTypes.func.isRequired,
};
