import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Paper,
  Collapse,
  makeStyles,
  Tooltip,
  IconButton,
  Typography,
  Box,
} from '@material-ui/core';

import SourceList from '../../../models/SourceList';
import LiverySource from '../../../models/LiverySource';

import UpArrowIcon from 'mdi-react/ChevronUpIcon';
import DownArrowIcon from 'mdi-react/ChevronDownIcon';
import Contributor from '../../../models/Contributor';
import ContributorBadge from '../../ContributorBadge';

const useTableStyles = makeStyles({
  tableContainerStyle: {
    marginTop: 32,
  },
  tableHeadStyle: {
    background: '#020202',
  },
  tableBodyStyle: {
    '& tr:last-child': {
      '& td': {
        borderBottom: 0,
      },
    },
  },
});

/**
 * Provides a nice and clean table of Livery Sources from an input of data
 *
 * @export
 *
 * @param {Object} props
 * @param {LiverySource[]} props.sourceList List of livery sources
 *
 * @return {import('react').ReactNode}
 */
export default function LiverySourcesTable(props) {
  const { sourceList } = props;

  /** @type {LiverySource[]} */
  const Sources = sourceList.sort((a, b) => (a.name > b.name ? 1 : -1));
  const styles = useTableStyles();

  return (
    <>
      <TableContainer component={Paper} className={styles.tableContainerStyle}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Livery pack</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={styles.tableBodyStyle}>
            {Sources.map(source => {
              return <ExpandableRow key={source.name + source.description + source.versionCode} source={source} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  contributorChip: {
    marginRight: 4,
    '&:last-child': {
      marginRight: 0,
    },
  },
});

/**
 * Creates an expandable table row from a instance of [LiverySource]
 *
 * @param {Object} props
 * @param {LiverySource} props.source Instance of [LiverySource]
 *
 * @return {React.ReactNode}
 */
function ExpandableRow(props) {
  const { source } = props;

  const classes = useRowStyles();

  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow onClick={() => setOpen(!open)} hover className={classes.root}>
        <TableCell component="th" scope="row" style={{ display: 'flex' }}>
          <Tooltip title="Expand" aria-label="expand">
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <UpArrowIcon /> : <DownArrowIcon />}
            </IconButton>
          </Tooltip>
          <div style={{ lineHeight: '30px', marginLeft: 8 }}>{source.name}</div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1} paddingBottom={0.5}>
              <LiveryPackDetailsSection fieldName="Description" value={source.description} />
              <LiveryPackDetailsSection fieldName="Version" value={source.humanVersion} />
              <LiveryPackDetailsSection
                fieldName="Contributors"
                value={source.contributors.map(contributor => (
                  <ContributorBadge className={classes.contributorChip} key={contributor.name} contributor={contributor} />
                ))}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const useDetailsSectionStyles = makeStyles({
  sectTitle: { textTransform: 'uppercase', marginBottom: 2 },
});

/**
 * Generates a section of the [ExpandableRow] from a field name and value.
 *
 * @param {Object} props
 * @param {string} props.fieldName Section title
 * @param {React.ReactNode} props.value Section value/description
 *
 * @return {React.ReactNode}
 */
function LiveryPackDetailsSection(props) {
  const classes = useDetailsSectionStyles();

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
