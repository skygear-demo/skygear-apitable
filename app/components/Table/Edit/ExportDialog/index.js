/* @flow */

import React from 'react';
import { CSVLink } from 'react-csv';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const actions = (handleClose) => [
  <RaisedButton
    label="DONE"
    primary
    onTouchTap={handleClose}
  />,
];

type ExportDialogProps = {
  exportData: any,
  show: boolean,
  handleClose: Function
}

const ExportDialog = ({ exportData, show, handleClose }: ExportDialogProps) => (
  <Dialog
    title="Export Data"
    actions={actions(handleClose)}
    modal
    open={show}
  >
    <Table selectable={false}>
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow>
          <TableHeaderColumn style={{ width: '50%', paddingRight: 0 }}>Format</TableHeaderColumn>
          <TableHeaderColumn>Download</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        <TableRow>
          <TableRowColumn style={{ width: '48%', paddingRight: 0 }}>
            CSV
          </TableRowColumn>
          <TableRowColumn>
            <CSVLink
              data={exportData}
              filename="export.csv"
              target="_blank"
            >
              <FlatButton
                label="Download"
                primary
              />
            </CSVLink>
          </TableRowColumn>
        </TableRow>
      </TableBody>
    </Table>
  </Dialog>
);

export default ExportDialog;
