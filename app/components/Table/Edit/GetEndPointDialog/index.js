/* @flow */

import React from 'react';
import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';
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
  tokens: any,
  show: boolean,
  handleTokenWritability: Function,
  handleIssueToken: Function,
  handleRevokeToken: Function,
  handleClose: Function,
  viewTokenDetail: Function
}

const GetEndPointDialog = ({ appName, id, tokens, show, handleTokenWritability, handleIssueToken, handleRevokeToken, handleClose, viewTokenDetail }: GetEndPointDialogProps) => (
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
          <TableHeaderColumn style={{ width: '48%', paddingRight: 0 }}>Table Access Token</TableHeaderColumn>
          <TableHeaderColumn style={{ width: '14%' }}>Writable</TableHeaderColumn>
          <TableHeaderColumn>Action</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody displayRowCheckbox={false}>
        {tokens.map((token) => (
          <TableRow key={token.get('token')}>
            <TableRowColumn style={{ width: '48%', paddingRight: 0 }}>
              {token.get('token')}
            </TableRowColumn>
            <TableRowColumn style={{ width: '10%' }}>
              <Toggle
                defaultToggled={token.get('writable')}
                onToggle={handleTokenWritability(token.get('token'))}
              />
            </TableRowColumn>
            <TableRowColumn>
              <FlatButton
                label="View"
                primary
                onTouchTap={handleViewAPI(appName, id, token.get('token'))}
              />
              <FlatButton
                label="Detail"
                primary
                onTouchTap={viewTokenDetail(token.get('token'), token.get('writable'))}
              />
              <FlatButton
                label="Revoke"
                secondary
                onTouchTap={handleRevokeToken(token.get('token'))}
              />
            </TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>}
  </Dialog>
);

export default GetEndPointDialog;
