/* @flow */

import React from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  renderTextField,
  renderCheckbox,
  renderSelectField,
} from 'utils/renderFields';
import { cellTypes } from 'utils/cellTypes';

const validate = (values) => {
  const errors = {};
  if (!values.get('name')) errors.name = 'Required';
  if (!values.get('data')) errors.data = 'Required';
  else if (!/^[a-zA-Z0-9]+$/.test(values.get('data'))) errors.data = 'Allows alphabet and numbers only';
  if (!values.get('type')) errors.type = 'Required';
  return errors;
};

const renderCellTypeOption = (type, name) => <MenuItem key={type} value={type} primaryText={name} />;

const actions = (handleClose, handleSubmit, submitting) => [
  <FlatButton
    label="Cancel"
    primary
    onTouchTap={handleClose}
  />,
  <RaisedButton
    label="Add"
    primary
    onTouchTap={handleSubmit}
    disabled={submitting}
  />,
];

type AddFieldDialogProps = {
  show: boolean,
  handleClose: Function,
  handleSubmit: Function,
  submitting: boolean
}

const AddFieldDialog = ({ show, handleClose, handleSubmit, submitting }: AddFieldDialogProps) => (
  <Dialog
    title="Add a new column"
    actions={actions(handleClose, handleSubmit, submitting)}
    modal
    open={show}
  >
    <form onSubmit={handleSubmit}>
      <Field
        name="name"
        label="Title"
        component={renderTextField}
      />

      <Field
        name="data"
        label="Data Name"
        component={renderTextField}
      />

      <Field
        name="type"
        component={renderSelectField}
        label="Data Type"
      >
        {Object.keys(cellTypes).map(
          (type) => renderCellTypeOption(type, cellTypes[type])
        )}
      </Field>

      <Field
        name="allowEmpty"
        component={renderCheckbox}
        label="Allow Empty"
      />
    </form>
  </Dialog>
);

export default reduxForm({
  form: 'addField',
  validate,
})(AddFieldDialog);
