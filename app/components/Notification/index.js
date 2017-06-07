import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';

type NotificationProps = {
  show: boolean,
  message: string,
  hideNotification: Function
}

class Notification extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.show !== nextProps.show;
  }

  props: NotificationProps

  render() {
    const { show, message, hideNotification } = this.props;
    return (
      <Snackbar
        open={show}
        message={message}
        autoHideDuration={4000}
        onRequestClose={hideNotification}
      />
    );
  }
}

export default Notification;
