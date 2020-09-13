import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Checkbox, Collapse, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';
import { Virtuoso } from 'react-virtuoso';
import FieldValueDisplay from './FieldValueDisplay';

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

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <ListItem button /*onClick={setIsExpanded(v => !v)}*/>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={GetIndexOfObjectInArray(livery) !== -1}
            // tabIndex={-1}
            disableRipple
            onChange={async e => {
              if (e.target.checked) {
                GetIndexOfObjectInArray(livery) === -1 && AddSelectedLivery(livery);
              } else {
                GetIndexOfObjectInArray(livery) !== -1 && RemoveSelectedLivery(livery);
              }
            }}
            // inputProps={{ 'aria-labelledby': 'labelId' }}
          />
        </ListItemIcon>
        <ListItemText primary={livery.fileName.substr(livery.fileName.indexOf('/') + 1).split('.zip')[0]} />
      </ListItem>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <FieldValueDisplay
          fieldName="Version"
          value={
            <Tooltip title="The version is a single unique string that represents the contents of all files in the livery">
              <span style={{ borderBottom: '#aaaa dotted 2px', cursor: 'help' }}>{livery.checkSum.substr(0, 8)}</span>
            </Tooltip>
          }
        />
      </Collapse>
    </>
  );
}

LiveryList.propTypes = {
  liveries: PropTypes.arrayOf(PropTypes.object).isRequired,
  GetIndexOfObjectInArray: PropTypes.func.isRequired,
  AddSelectedLivery: PropTypes.func.isRequired,
  RemoveSelectedLivery: PropTypes.func.isRequired,
};

ListRow.propTypes = {
  livery: PropTypes.object.isRequired,
  GetIndexOfObjectInArray: PropTypes.func.isRequired,
  AddSelectedLivery: PropTypes.func.isRequired,
  RemoveSelectedLivery: PropTypes.func.isRequired,
};
