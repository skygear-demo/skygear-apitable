import skygear from 'skygear';
import { takeLatest } from 'redux-saga';
import { take, call, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { ATTEMPT_LOGIN } from './constants';

export function* accountLogin({
  payload: { email, password },
  resolve,
  reject,
}) {
  try {
    yield call([skygear, skygear.loginWithEmail], email, password);
    resolve();
  } catch ({ error: { message } }) {
    reject(message);
  }
}

export function* accountLoginData() {
  const watcher = yield takeLatest(ATTEMPT_LOGIN, accountLogin);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  accountLoginData,
];
