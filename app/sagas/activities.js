import { takeLatest, call, put } from 'redux-saga/effects';
import isEmpty from 'lodash/get';
import moment from 'moment-timezone';
import apiX from './api';
import {
  ACTIVITIES_UPDATE,
  FINISH_UNSCHEDULED_ACTIVITY,
  UNSCHEDULED_ACTIVITY_SUCCESS,
  START_CHILD_ACTIVITY,
  FINISH_CHILD_ACTIVITY,
  EXIT_CHILD_ACTIVITY,
  IMMEDIATE_SYNC_REQ,
  SAVE_CHILD_ACTIVITY,
  activitiesFailure,
  activitiesPersist,
  activitiesDestroy,
  storeTemplatesLocally,
  unscheduledActivityWithErrorMessage,
  immediateSyncRequest,
  startUnscheduledActivity,
  unscheduledActivitySuccess,
  unscheduledActivityFailure,
  immediateEventSyncSuccess,
  immediateEventSyncFailure,
  unscheduledActivityInvocationSuccess,
  unscheduledActivityInvocationFailure,
  startChildActivityInvocationSuccess,
  startChildActivityInvocationFailure,
  ABORT_UNSCHEDULED_ACTIVITY,
} from '../actions/activities';
import { ACTIVITY_INVOCATION, synchronizeStorage } from '../actions/sync';
import { getUnscheduledId } from '../utils/ids';
import { store } from '../utils/PersistentStorage';


const getUpdatesDictionary = updates => updates.reduce(
  (dictionary, update) =>
    Object.assign(dictionary, { [update.type]: update })
  , {},
);


export function* activitiesSaga(action/* , api = API */) {
  try {
    const { updates } = action.activities;
    if (isEmpty(updates)) {
      throw new Error('Empty updates');
    }
    const { schedule } = getUpdatesDictionary(updates);
    const { buffer: { persist_activity_templates: persist } } = schedule;
    const { buffer: { delete_activity_template_ids: destroy } } = schedule;
    yield put(activitiesPersist(persist));
    if (!isEmpty) {
      yield put(activitiesDestroy(destroy));
    }
  } catch (error) {
    // console.log(error);
    yield put(activitiesFailure(error));
  }
}

export function* unscheduledActivityInvocation(action, api = apiX) {
  try {
    const response = yield call(api.unscheduledActivityInvocation, action);
    if ((response && response.status === 200) && (response.data.responses[0].status_code === 1)) {debugger;
      if (!response.data.responses['0'].buffer.error) {
        const localId = getUnscheduledId();
        const elementToPersist = { ...response.data.responses['0'].buffer.activity_templates[0], status: 'STARTED', localId };
        yield put(unscheduledActivitySuccess(response, elementToPersist));
        yield put(synchronizeStorage(response));
        yield put(storeTemplatesLocally(response));
      } else {
        yield put(unscheduledActivityWithErrorMessage(response.data.responses['0'].buffer.error));
      }
    } else {
      if (response._msg==='NO_CONN') {
        const template = action.tpl;
        let updates = store.get('updates');
        updates = updates ? updates.find(u => u.type === 'config') : null;
        updates = updates || {
          buffer: {
            settings: {
              'activity.unscheduled_template_ids': [],
            },
            activity_templates: [],
          },
        };
        const activityTemplates = updates.buffer.activity_templates;
        const activityTemplate = activityTemplates.find(t =>
          t.id === template);
        const localId = getUnscheduledId();
        const elementToPersist = { ...activityTemplate, status: 'STARTED', localId };
        yield put(unscheduledActivitySuccess(response, elementToPersist));
        //yield put(synchronizeStorage(response)); we didn't get a response!
        //yield put(storeTemplatesLocally(response));
      }
      yield put(unscheduledActivityFailure(response));
    }
  } catch (error) { // If data is null the application will throw exception.
    yield put(unscheduledActivityFailure(error));
  }
}

export function* startUnscheduledActivityGen(action, api = apiX) {
  try {
    const response = yield call(api.startUnscheduledActivity, action); // do the invocation
    if ((response && response.status === 200) && (response.data.responses[0].status_code === 1)) {
      yield put(startUnscheduledActivity(response));
      yield put(synchronizeStorage(response));
      yield put(activitiesPersist([action.elementToPersist])); // Here, CMFL-213
      yield put(unscheduledActivityInvocationSuccess(response));
    } else {
      yield put(unscheduledActivityInvocationFailure(response));
    }
  } catch (error) { // If data is null the application will throw exception.
    yield put(unscheduledActivityInvocationFailure(error));
  }
}

export function* saveChildActivity(action, api = apiX) {
  try {
    yield call(api.saveChildActivity, action);
  } catch (error) {
    yield put(unscheduledActivityInvocationFailure(error));
  }
}

export function* startChildActivity(action, api = apiX) {
  try {
    const response = yield call(api.startChildActivity, action);
    if ((response && response.status === 200) && (response.data.responses[0].status_code === 1)) {
      yield put(startChildActivityInvocationSuccess(response));
      yield put(synchronizeStorage(response));
    } else {
      yield put(startChildActivityInvocationFailure(response));
    }
  } catch (error) { // If data is null the application will throw exception.
    yield put(startChildActivityInvocationFailure(error));
  }
}

export function* finishChildActivity(action) {
  const time = action.activity.time ? action.activity.time : {};
  yield put(immediateSyncRequest({
    event: 'finsh',
    time: {
      ts: time.ts ? time.ts : new Date().getTime(),
      tz: time.tz ? time.tz : moment.tz.guess(),
      src: 'S',
    },
    activity: action.activity.childAct,
    parent_activity: action.activity.parentAct,
    template: action.activity.activity,
    workgroup: action.accobj.workgroups[0],
    form_responses: action.fg.getFormResponses(),
  }));
}

export function* abortChildActivity(action) {
  const time = action.activity.time ? action.activity.time : {};
  yield put(immediateSyncRequest({
    event: 'abort',
    time: {
      ts: time.ts ? time.ts : new Date().getTime(),
      tz: time.tz ? time.tz : moment.tz.guess(),
      src: 'S',
    },
    activity: action.activity.childAct,
    parent_activity: action.activity.parentAct,
    template: action.activity.activity,
    workgroup: action.accobj.workgroups[0],
  }));
}

export function* finishUnscheduledActivity(action) {
  const time = action.activity.time ? action.activity.time : {};
  yield put(immediateSyncRequest({
    event: 'finsh',
    time: {
      ts: time.ts ? time.ts : new Date().getTime(),
      tz: time.tz ? time.tz : moment.tz.guess(),
      src: 'S',
    },
    activity: action.activity.localId,
    template: action.activity.id,
    workgroup: action.activity.workgroups[0],
    form_responses: [],
  }));
}

export function* abortUnscheduledActivity(action) {
  const time = action.activity.time ? action.activity.time : {};
  yield put(immediateSyncRequest({
    event: 'abort',
    time: {
      ts: time.ts ? time.ts : new Date().getTime(),
      tz: time.tz ? time.tz : moment.tz.guess(),
      src: 'S',
    },
    activity: action.activity.localId,
    template: action.activity.id,
    workgroup: action.activity.workgroups[0],
    form_responses: [],
  }));
}

export function* immediateActivitySync(action, api = apiX) {
  try {
    const response = yield call(api.syncRequests, action.event);
    if ((response && response.status === 200) && (response.data.responses[0].status_code === 1)) {
      yield put(immediateEventSyncSuccess(response));
      yield put(synchronizeStorage(response));
    } else {
      yield put(immediateEventSyncFailure(response));
    }
  } catch (error) { // If data is null the application will throw exception.
    yield put(immediateEventSyncFailure(error));
  }
}

export default function* collectionsSaga() {
  yield takeLatest(IMMEDIATE_SYNC_REQ, immediateActivitySync);
  yield takeLatest(ACTIVITIES_UPDATE, activitiesSaga);
  yield takeLatest(START_CHILD_ACTIVITY, startChildActivity);
  yield takeLatest(FINISH_CHILD_ACTIVITY, finishChildActivity);
  yield takeLatest(SAVE_CHILD_ACTIVITY, saveChildActivity);
  yield takeLatest(FINISH_UNSCHEDULED_ACTIVITY, finishUnscheduledActivity);
  yield takeLatest(ACTIVITY_INVOCATION, unscheduledActivityInvocation);
  yield takeLatest(EXIT_CHILD_ACTIVITY, abortChildActivity);
  yield takeLatest(ABORT_UNSCHEDULED_ACTIVITY, abortUnscheduledActivity);
  yield takeLatest(UNSCHEDULED_ACTIVITY_SUCCESS, startUnscheduledActivityGen);
}
