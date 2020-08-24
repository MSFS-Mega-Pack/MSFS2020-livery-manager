import React from 'react';
import { Table, TableBody, TableRow, TableCell, Checkbox, TableContainer, TableHead, Paper } from '@material-ui/core';

import SourceList from '../../../models/SourceList';
import LiverySource from '../../../models/LiverySource';

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

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Sources.map(source => {
              return (
                <TableRow key={source.name + source.description + source.versionCode}>
                  <TableCell>{source.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
