/* @flow */

import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const actions = (handleClose, handleRemoveFields) => [
  <FlatButton
    label="Cancel"
    onTouchTap={handleClose}
  />,
  <RaisedButton
    label="Remove"
    secondary
    onTouchTap={handleRemoveFields}
  />,
];

type RemoveColumnDialogProps = {
  show: boolean,
  fields: Array<string>,
  handleClose: Function,
  handleRemoveFields: Function
}

const RemoveColumnDialog = ({ show, fields, handleClose, handleRemoveFields }: RemoveColumnDialogProps) => (
  <Dialog
    title="Remove Columns"
    actions={actions(handleClose, handleRemoveFields)}
    modal
    open={show}
  >
    Are you sure to Remove the column {fields.join(', ')}?
    <br />
    <strong>You cannot undo this action.</strong>
  </Dialog>
);

export default RemoveColumnDialog;
