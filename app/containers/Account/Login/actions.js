import {
  ATTEMPT_LOGIN,
} from './constants';

export function attemptLogin(email, password, resolve, reject) {
  return {
    type: ATTEMPT_LOGIN,
    payload: {
      email,
      password,
    },
    resolve,
    reject,
  };
}
