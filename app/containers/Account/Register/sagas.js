import skygear from 'skygear';
import ReactGA from 'react-ga';
import { takeLatest } from 'redux-saga';
import { take, call, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { ATTEMPT_REGISTER } from './constants';

export function* accountRegister({
  payload: { email, password, profile },
  resolve,
  reject,
}) {
  try {
    ReactGA.event({
      category: 'User',
      action: 'Register a new account',
    });

    yield call([skygear, skygear.signupWithEmailAndProfile], email, password, profile);
    resolve();
  } catch ({ error: { message } }) {
    reject(message);
  }
}

export function* accountRegisterData() {
  const watcher = yield takeLatest(ATTEMPT_REGISTER, accountRegister);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  accountRegisterData,
];
