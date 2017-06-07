import {
  ATTEMPT_REGISTER,
} from './constants';

export function attemptRegister(email, password, profile, resolve, reject) {
  return {
    type: ATTEMPT_REGISTER,
    payload: {
      email,
      password,
      profile,
    },
    resolve,
    reject,
  };
}
