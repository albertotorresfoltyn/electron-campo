export const SYNC_CLEANSE = 'SYNC_CLEANSE';
export const SYNC_REQUEST = 'SYNC_REQUEST';
export const SYNC_SUCCESS = 'SYNC_SUCCESS';
export const SYNC_FAILURE = 'SYNC_FAILURE';
export const SYNC_CONNECT = 'SYNC_CONNECT';
export const SYNC_UPDATES = 'SYNC_UPDATES';
export const ACTIVITY_INVOCATION = 'ACTIVITY_INVOCATION';
export const SET_FORM_VIEW = 'SET_FORM_VIEW';
export const SYNCHRONIZE_STORAGE = 'SYNCHRONIZE_STORAGE';


export function syncCleanse() {
  return {
    type: SYNC_CLEANSE,
  };
}

export function activityInvocation(userName, userId, tpl) {
  return {
    type: ACTIVITY_INVOCATION,
    user: userName,
    userId,
    tpl,
  };
}

export function syncRequest(request) {
  return {
    type: SYNC_REQUEST,
    request,
  };
}

export function syncSuccess(response) {
  return {
    type: SYNC_SUCCESS,
    response,
  };
}

export function syncFailure(error) {
  return {
    type: SYNC_FAILURE,
    error,
  };
}

export function syncConnect(response) {
  return {
    type: SYNC_CONNECT,
    response,
  };
}

export function syncUpdates(updates) {
  return {
    type: SYNC_UPDATES,
    updates,
  };
}


export function setFormView(formObject) {
  return {
    type: SET_FORM_VIEW,
    formObject,
  };
}

export function synchronizeStorage(response) {
  return {
    type: SYNCHRONIZE_STORAGE,
    response,
  };
}
