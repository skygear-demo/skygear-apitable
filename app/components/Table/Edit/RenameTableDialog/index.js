/* @flow */

import React from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  renderTextField,
} from 'utils/renderFields';

const validate = (values) => {
  const errors = {};
  if (!values.get('name')) errors.name = 'Required';
  return errors;
};

const actions = (handleClose, handleSubmit, submitting) => [
  <FlatButton
    label="Cancel"
    primary
    onTouchTap={handleClose}
  />,
  <RaisedButton
    label="Rename"
    primary
    onTouchTap={handleSubmit}
    disabled={submitting}
  />,
];

type RenameTableDialogProps = {
  show: boolean,
  handleClose: Function,
  handleSubmit: Function,
  submitting: boolean
}

const RenameTableDialog = ({ show, handleClose, handleSubmit, submitting }: RenameTableDialogProps) => (
  <Dialog
    title="Rename Table"
    actions={actions(handleClose, handleSubmit, submitting)}
    modal
    open={show}
  >
    <form onSubmit={handleSubmit}>
      <Field
        name="name"
        label="Name"
        component={renderTextField}
      />
    </form>
  </Dialog>
);

export default reduxForm({
  form: 'renameTable',
  validate,
})(RenameTableDialog);
