import {
  takeLatest,
  call,
  put,
  select,
} from 'redux-saga/effects';
import {
  SYNC_CONNECT,
  syncSuccess,
  syncCleanse,
  syncFailure,
  syncUpdates,
  synchronizeStorage,
} from '../actions/sync';

import { activitiesUpdate } from '../actions/activities';
import API from './api';

const getRequests = (state) => {
  const { sync: { requests } } = state;
  return requests;
};

export function* syncSaga(/* action */) {
  // console.log('syncSaga');
  const requests = yield select(getRequests);
  try {
    const response = yield call(API.sync, requests);
    if (response && response.status === 200) {
      yield put(syncSuccess(response.data));
      yield put(syncUpdates(response.data));
      // Put to another actions
      yield put(activitiesUpdate(response.data));
      // yield fork(activitiesUpdate, response);
      yield put(syncCleanse());
      yield put(synchronizeStorage(response));
    } else {
      yield put(syncFailure(new Error('Bad Response')));
    }
  } catch (error) { // catch the data.response
    yield put(syncFailure(error));
  }
}

export default function* collectionsSaga() {
  yield takeLatest(SYNC_CONNECT, syncSaga);
}

