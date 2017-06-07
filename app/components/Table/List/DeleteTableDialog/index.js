import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const actions = (handleClose, handleSubmit, submitting) => [
  <FlatButton
    label="Cancel"
    primary
    onTouchTap={handleClose}
  />,
  <RaisedButton
    label="Delete"
    primary
    onTouchTap={handleSubmit}
    disabled={submitting}
  />,
];

type DeleteTableDialogProps = {
  show: boolean,
  pendingDeleteTable: any,
  handleClose: Function,
  handleSubmit: Function,
  submitting: boolean
}

const DeleteTableDialog = ({ show, pendingDeleteTable, handleClose, handleSubmit, submitting }: DeleteTableDialogProps) => (
  pendingDeleteTable && <Dialog
    title={`You are about to delete table "${pendingDeleteTable.get('name')}". Are you sure?`}
    actions={actions(handleClose, handleSubmit, submitting)}
    modal
    open={show}
  />
);

export default DeleteTableDialog;
