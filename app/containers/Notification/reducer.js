/*
 *
 * Notification reducer
 *
 */

import { fromJS } from 'immutable';

import {
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
} from './constants';

const initialState = fromJS({
  show: false,
  message: '',
});

function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return state
        .set('show', true)
        .set('message', action.payload.message);
    case HIDE_NOTIFICATION:
      return state
        .set('show', false);
    default:
      return state;
  }
}

export default notificationReducer;
