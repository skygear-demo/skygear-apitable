import React from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';

type TextFieldProps = {
  input: any,
  label: string,
  meta: {
    touched: boolean,
    error: string
  }
}

export const renderTextField = ({ input, label, meta: { touched, error }, ...custom }: TextFieldProps) => (
  <TextField
    hintText={label}
    floatingLabelText={label}
    errorText={touched && error}
    fullWidth
    {...input}
    {...custom}
  />
);

type SelectFieldProps = {
  input: any,
  label: string,
  meta: {
    touched: boolean,
    error: string
  },
  children: any
}

export const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}: SelectFieldProps) => (
  <SelectField
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    {...custom}
  >
    {children}
  </SelectField>
);

type CheckboxProps = {
  input: any,
  label: string
}

export const renderCheckbox = ({ input, label }: CheckboxProps) => (
  <Checkbox
    label={label}
    checked={!!input.value}
    onCheck={input.onChange}
  />
);
