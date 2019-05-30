
export const ACTIVITIES_UPDATE = 'ACTIVITIES_UPDATE';
export const ACTIVITIES_REMOVE = 'ACTIVITIES_REMOVE';
export const ACTIVITIES_FAILURE = 'ACTIVITIES_FAILURE';
export const ACTIVITIES_OPTIONS = 'ACTIVITIES_OPTIONS';
export const ACTIVITIES_PERSIST = 'ACTIVITIES_PERSIST';
export const ACTIVITIES_DESTROY = 'ACTIVITIES_DESTROY';
export const ACTIVITY_INVOCATION_SUCCESS = 'ACTIVITY_INVOCATION_SUCCESS';
export const ACTIVITY_INVOCATION_ERROR = 'ACTIVITY_INVOCATION_ERROR';
export const START_UNSCHEDULED_ACTIVITY = 'START_UNSCHEDULED_ACTIVITY';
export const FINISH_UNSCHEDULED_ACTIVITY = 'FINISH_UNSCHEDULED_ACTIVITY';
export const UNSCHEDULED_ACTIVITY_SUCCESS = 'UNSCHEDULED_ACTIVITY_SUCCESS';
export const UNSCHEDULED_ACTIVITY_FAILURE = 'UNSCHEDULED_ACTIVITY_FAILURE';
export const START_CHILD_ACTIVITY = 'START_CHILD_ACTIVITY';
export const FINISH_CHILD_ACTIVITY = 'FINISH_CHILD_ACTIVITY';
export const EXIT_CHILD_ACTIVITY = 'EXIT_CHILD_ACTIVITY';
export const SAVE_CHILD_ACTIVITY = 'SAVE_CHILD_ACTIVITY';
export const START_CHILD_ACTIVITY_INVOCATION_SUCCESS = 'START_CHILD_ACTIVITY_INVOCATION_SUCCESS';
export const START_CHILD_ACTIVITY_INVOCATION_ERROR = 'START_CHILD_ACTIVITY_INVOCATION_ERROR';
export const SET_FORM_TITLE = 'SET_FORM_TITLE';
export const ABORT_UNSCHEDULED_ACTIVITY = 'ABORT_UNSCHEDULED_ACTIVITY';
export const IMMEDIATE_SYNC_REQ = 'IMMEDIATE_SYNC_REQ';
export const IMMEDIATE_SYNC_SUCCESS = 'IMMEDIATE_SYNC_SUCCESS';
export const IMMEDIATE_SYNC_FAILURE = 'IMMEDIATE_SYNC_FAILURE';
export const SHOW_SERVER_MESSAGE = 'SHOW_SERVER_MESSAGE';
export const STORE_TEMPLATES_LOCALLY = 'STORE_TEMPLATES_LOCALLY';
export const UPDATE_TEMPLATE = 'UPDATE_TEMPLATE';
export function activitiesUpdate(activities) {
  return {
    type: ACTIVITIES_UPDATE,
    activities,
  };
}

export function activitiesRemove(activities) {
  return {
    type: ACTIVITIES_REMOVE,
    activities,
  };
}

export function activitiesFailure(error) {
  return {
    type: ACTIVITIES_FAILURE,
    error,
  };
}

export function activitiesPersist(activitie) {
  return {
    type: ACTIVITIES_PERSIST,
    activitie,
  };
}

export function immediateSyncRequest(event) {
  return {
    type: IMMEDIATE_SYNC_REQ,
    event,
  };
}

export function unscheduledActivityWithErrorMessage(message) {
  return {
    type: SHOW_SERVER_MESSAGE,
    message,
  };
}

export function storeTemplatesLocally(response) {
  return {
    type: STORE_TEMPLATES_LOCALLY,
    response,
  };
}

export function activitiesDestroy(id) {
  return {
    type: ACTIVITIES_DESTROY,
    id,
  };
}

export function unscheduledActivityInvocationSuccess(response) {
  return {
    type: ACTIVITY_INVOCATION_SUCCESS,
    response,
  };
}

export function unscheduledActivityInvocationFailure(error) {
  return {
    type: ACTIVITY_INVOCATION_ERROR,
    error,
  };
}

export function startUnscheduledActivity(response) {
  return {
    type: START_UNSCHEDULED_ACTIVITY,
    response,
  };
}

export function unscheduledActivitySuccess(response, elementToPersist) {
  return {
    type: UNSCHEDULED_ACTIVITY_SUCCESS,
    response,
    elementToPersist,
  };
}

export function unscheduledActivityFailure(response) {
  return {
    type: UNSCHEDULED_ACTIVITY_FAILURE,
    response,
  };
}
export function startChildActivity(activity, childAct, parentAct) {
  return {
    type: START_CHILD_ACTIVITY,
    activity,
    childAct,
    parentAct,
  };
}

export function startChildActivityInvocationSuccess(response) {
  return {
    type: START_CHILD_ACTIVITY_INVOCATION_SUCCESS,
    response,
  };
}

export function startChildActivityInvocationFailure(error) {
  return {
    type: START_CHILD_ACTIVITY_INVOCATION_ERROR,
    error,
  };
}

export function finishChildActivity(activity, accobj, fg) {
  return {
    type: FINISH_CHILD_ACTIVITY,
    activity,
    accobj,
    fg,
  };
}

export function exitChildActivity(activity, accobj) {
  return {
    type: EXIT_CHILD_ACTIVITY,
    activity,
    accobj,
  }
}

export function saveChildActivity(activity, childAct, actObj) {
  return {
    type: SAVE_CHILD_ACTIVITY,
    activity,
    childAct,
    actObj,
  }
}

export function finishUnscheduledActivity(activity) {
  return {
    type: FINISH_UNSCHEDULED_ACTIVITY,
    activity,
  };
}

export function abortUnscheduledActivity(activity) {
  return {
    type: ABORT_UNSCHEDULED_ACTIVITY,
    activity,
  };
}

export function setFormTitle(formTitle) {
  return {
    type: SET_FORM_TITLE,
    formTitle,
  };
}

export function immediateEventSyncSuccess(res) {
  return {
    type: IMMEDIATE_SYNC_SUCCESS,
    res,
  };
}

export function immediateEventSyncFailure(res) {
  return {
    type: IMMEDIATE_SYNC_FAILURE,
    res,
  };
}

export function updateTemplate(template) {
  return {
    type: UPDATE_TEMPLATE,
    template,
  };
}
