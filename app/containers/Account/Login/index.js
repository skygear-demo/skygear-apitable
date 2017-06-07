import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push as changeRouteAction } from 'react-router-redux';
import { showNotification as showNotificationAction } from 'containers/Notification/actions';
import * as actions from './actions';
import AccountLogin from '../../../components/Account/Login';

type AccountLoginContainerProps = {
  attemptLogin: Function,
  changeRoute: Function,
  showNotification: Function
}

class AccountLoginContainer extends Component {
  props: AccountLoginContainerProps

  handleSubmit = (values) => {
    const email = values.get('email');
    const password = values.get('password');

    const { attemptLogin, changeRoute, showNotification } = this.props;

    return new Promise((resolve, reject) => {
      attemptLogin(email, password, resolve, reject);
    })
    .then(() => changeRoute('/'))
    .catch(showNotification);
  }

  render() {
    return (
      <AccountLogin
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
)(AccountLoginContainer);
