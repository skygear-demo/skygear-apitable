/* @flow */

import React from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const apiBaseUrl = (appName: string, id: string): string => `https://${appName}.skygeario.com/api/tables?id=${id}`;
const withRecordUrl = (baseUrl): string => `${baseUrl}&record=<< Record ID >>`;
const withToken = (url, token) => `${url}&token=${token}`;

const actions = (handleClose) => [
  <RaisedButton
    label="DONE"
    primary
    onTouchTap={handleClose}
  />,
];

type EndPointDetailDialogProps = {
  appName: string,
  id: string,
  token: any,
  show: boolean,
  handleClose: Function
}

const EndPointDetailDialog = ({ appName, id, token, show, handleClose }: EndPointDetailDialogProps) => (
  <Dialog
    title="End Point Information"
    actions={actions(handleClose)}
    modal
    open={show}
  >
    <TextField
      floatingLabelText="Fetch table with records: GET"
      value={withToken(apiBaseUrl(appName, id), token.get('token'))}
      fullWidth
    />

    <TextField
      floatingLabelText="Fetch table with a specified record: GET"
      value={withToken(withRecordUrl(apiBaseUrl(appName, id)), token.get('token'))}
      fullWidth
    />

    {token.get('writable') && (
      <div>
        <TextField
          floatingLabelText="Insert a new record: POST"
          value={withToken(apiBaseUrl(appName, id), token.get('token'))}
          fullWidth
        />

        <TextField
          floatingLabelText="Update the record: PATCH"
          value={withToken(withRecordUrl(apiBaseUrl(appName, id)), token.get('token'))}
          fullWidth
        />

        <TextField
          floatingLabelText="Delete the record: DELETE"
          value={withToken(withRecordUrl(apiBaseUrl(appName, id)), token.get('token'))}
          fullWidth
        />
      </div>
    )}
  </Dialog>
);

export default EndPointDetailDialog;
