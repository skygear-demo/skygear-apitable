/* @flow */

import React from 'react';
import { reduxForm, Field } from 'redux-form/immutable';
import { Link } from 'react-router';
import { CardActions } from 'material-ui/Card';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import PersonIcon from 'material-ui/svg-icons/social/person';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import LockIcon from 'material-ui/svg-icons/action/lock';
import RaisedButton from 'material-ui/RaisedButton';
import { renderTextField } from 'utils/renderFields';
import CardLayout from '../../CardLayout';
import Heading from '../Heading';
import InputGroup from '../InputGroup';
import ButtonGroup from '../ButtonGroup';
import Footer from '../../Layout/Footer';

const validate = (values) => {
  const errors = {};
  if (!values.get('firstName')) errors.firstName = 'Required';
  if (!values.get('lastName')) errors.lastName = 'Required';
  if (!values.get('email')) errors.email = 'Required';
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.get('email'))) errors.email = 'Email Invalid';
  if (!values.get('password')) errors.password = 'Required';
  else if (values.get('password').length < 6) errors.password = 'Length of Password should be at least 6';
  if (!values.get('confirmPassword')) errors.confirmPassword = 'Required';
  else if (values.get('password') !== values.get('confirmPassword')) errors.confirmPassword = 'Does not match password';
  return errors;
};

type RegisterProps = {
  handleSubmit: Function,
  submitting: boolean
}

const Register = ({ handleSubmit, submitting }: RegisterProps) => (
  <div>
    <CardLayout>
      <form onSubmit={handleSubmit}>
        <Heading>
          <PersonIcon />
          <div>
            <Link to="/account/login">
              <BackIcon />
            </Link>
            User Register
          </div>
        </Heading>

        <InputGroup>
          <PersonIcon />
          <Field
            name="firstName"
            label="First Name"
            component={renderTextField}
          />
          <Field
            name="lastName"
            label="Last Name"
            component={renderTextField}
          />
        </InputGroup>

        <InputGroup>
          <EmailIcon />
          <Field
            name="email"
            label="Email"
            type="email"
            component={renderTextField}
          />
        </InputGroup>

        <InputGroup>
          <LockIcon />
          <Field
            name="password"
            label="Password"
            type="password"
            component={renderTextField}
          />
        </InputGroup>

        <InputGroup>
          <LockIcon />
          <Field
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            component={renderTextField}
          />
        </InputGroup>

        <CardActions>
          <ButtonGroup>
            <RaisedButton
              type="submit"
              primary label="Register"
              disabled={submitting}
            />
          </ButtonGroup>
        </CardActions>
      </form>
    </CardLayout>
    <Footer />
  </div>
);

export default reduxForm({
  form: 'register',
  validate,
})(Register);
