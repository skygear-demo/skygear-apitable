import React from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { renderTextField } from 'utils/renderFields';

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
    label="Create"
    primary
    onTouchTap={handleSubmit}
    disabled={submitting}
  />,
];

type CreateTableDialogProps = {
  show: boolean,
  handleClose: Function,
  handleSubmit: Function,
  submitting: boolean
}

const CreateTableDialog = ({ show, handleClose, handleSubmit, submitting }: CreateTableDialogProps) => (
  <Dialog
    title="Create a new table"
    actions={actions(handleClose, handleSubmit, submitting)}
    modal
    open={show}
  >
    <form onSubmit={handleSubmit}>
      <Field
        name="name"
        label="Table Name"
        component={renderTextField}
      />
    </form>
  </Dialog>
);

export default reduxForm({
  form: 'createTable',
  validate,
})(CreateTableDialog);
