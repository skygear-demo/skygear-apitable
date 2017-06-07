/* @flow */

import React from 'react';
import type { List } from 'immutable';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
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

const apiBaseUrl = (appName: string, id: string, token: string = ''): string => `https://${appName}.skygeario.com/api/tables?id=${id}&token=${token}`;
const handleViewAPI = (appName: string, id: string, token: string) => () => window.open(apiBaseUrl(appName, id, token));

const actions = (handleIssueToken, handleClose) => [
  <FlatButton
    label="Create New Token"
    primary
    onTouchTap={handleIssueToken}
  />,
  <RaisedButton
    label="DONE"
    primary
    onTouchTap={handleClose}
  />,
];

type GetEndPointDialogProps = {
  appName: string,
  id: string,
  tokens: List<string>,
  show: boolean,
  handleIssueToken: Function,
  handleRevokeToken: Function,
  handleClose: Function
}

const GetEndPointDialog = ({ appName, id, tokens, show, handleIssueToken, handleRevokeToken, handleClose }: GetEndPointDialogProps) => (
  <Dialog
    title="End Point Information"
    actions={actions(handleIssueToken, handleClose)}
    modal
    open={show}
  >
    <TextField
      floatingLabelText="End Point Base URL"
      value={apiBaseUrl(appName, id)}
      fullWidth
    />

    {!!tokens.size && <Table selectable={false}>
      <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
        <TableRow>
          <TableHeaderColumn style={{ width: '73.5%' }}>Table Access Token</TableHeaderColumn>
          <TableHeaderColumn>Action</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {tokens.map((token) => (
          <TableRow key={token}>
            <TableRowColumn style={{ width: '70%' }}>{token}</TableRowColumn>
            <TableRowColumn>
              <FlatButton
                label="View"
                primary
                onTouchTap={handleViewAPI(appName, id, token)}
              />
              <FlatButton
                label="Revoke"
                secondary
                onTouchTap={handleRevokeToken(token)}
              />
            </TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>}
  </Dialog>
);

export default GetEndPointDialog;
