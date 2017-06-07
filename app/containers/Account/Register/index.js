import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as changeRouteAction } from 'react-router-redux';
import { showNotification as showNotificationAction } from 'containers/Notification/actions';
import * as actions from './actions';
import AccountRegister from '../../../components/Account/Register';

type AccountRegisterContainerProps = {
  attemptRegister: Function,
  changeRoute: Function,
  showNotification: Function
}

class AccountRegisterContainer extends Component {
  props: AccountRegisterContainerProps

  handleSubmit = (values) => {
    const firstName = values.get('firstName');
    const lastName = values.get('lastName');
    const email = values.get('email');
    const password = values.get('password');

    const { attemptRegister, changeRoute, showNotification } = this.props;

    return new Promise((resolve, reject) => {
      attemptRegister(email, password, { firstName, lastName }, resolve, reject);
    })
    .then(() => changeRoute('/'))
    .catch(showNotification);
  }

  render() {
    return (
      <AccountRegister
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default connect(
  null,
  {
    changeRoute: changeRouteAction,
    showNotification: showNotificationAction,
    ...actions,
  },
)(AccountRegisterContainer);
