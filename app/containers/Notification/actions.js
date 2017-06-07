import {
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
} from './constants';

export function showNotification(message) {
  return {
    type: SHOW_NOTIFICATION,
    payload: {
      message,
    },
  };
}

export function hideNotification() {
  return {
    type: HIDE_NOTIFICATION,
  };
}
