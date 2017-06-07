import React from 'react';
import { connect } from 'react-redux';
import Notification from 'components/Notification';
import { hideNotification as hideNotificationAction } from './actions';

type NotificationContainerProps = {
  notification: any,
  hideNotification: Function
}

const NotificationContainer = ({ notification, hideNotification }: NotificationContainerProps) => (
  <Notification
    show={notification.get('show')}
    message={notification.get('message')}
    hideNotification={hideNotification}
  />
);

export default connect(
  (state) => ({ notification: state.get('notification') }),
  { hideNotification: hideNotificationAction },
)(NotificationContainer);
