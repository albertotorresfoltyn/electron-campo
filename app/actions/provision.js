export const SEND_CREDENTIALS = 'SEND_CREDENTIALS';
export const PROVISION_SUCCESS = 'PROVISION_SUCCESS';
export const PROVISION_FAILURE = 'PROVISION_FAILURE';

export const SEND_USER_DATA = 'SEND_USER_DATA';
export const SEND_USER_DATA_FAILURE = 'SEND_USER_DATA_FAILURE';
export const SEND_USER_DATA_SUCCESS = 'SEND_USER_DATA_SUCCESS';
export const STORE_AUTH_DATA = 'STORE_AUTH_DATA';
export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT';

export function sendCredentials(license, auth) {
  return {
    type: SEND_CREDENTIALS,
    license,
    auth,
  };
}

export function sendUserData(userId, lastName) {
  return {
    type: SEND_USER_DATA,
    userId,
    lastName,
  };
}

export function sendSecurityData({
  originalPassword,
  passwordCopy,
  firstQuestion,
  firstAnswer,
  secondQuestion,
  secondAnswer,
}) {
  return {
    type: STORE_AUTH_DATA,
    originalPassword,
    passwordCopy,
    firstQuestion,
    firstAnswer,
    secondQuestion,
    secondAnswer,
  };
}

export function login(password) {
  return {
    type: LOGIN_ATTEMPT,
    password,
  };
}

export function provisionFailure(response) {
  return {
    type: PROVISION_FAILURE,
    response,
  };
}

export function provisionSuccess(response) {
  return {
    type: PROVISION_SUCCESS,
    response,
  };
}

export function sendUserDataFailure(response) {
  return {
    type: SEND_USER_DATA_FAILURE,
    response,
  };
}

export function sendUserDataSuccess(response) {
  return {
    type: SEND_USER_DATA_SUCCESS,
    response,
  };
}
