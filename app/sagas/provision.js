import { takeLatest, call, put } from 'redux-saga/effects';
import { SEND_CREDENTIALS, provisionFailure, provisionSuccess } from '../actions/provision';
import apiX from './api';

export function* provisionSaga(action, api = apiX) {
  let response;
  if ((action.license) && (action.auth)) {
    try {
      response = yield call(api.provision, action);
      if ((response && response.status === 200) && (response.data.responses[0].status_code === 1)) {
        yield put(provisionSuccess(response));
      } else {
        yield put(provisionFailure(response));
      }
    } catch (error) { // If data is null the application will throw exception.
      yield put(provisionFailure(response));
    }
  }
}

export default function* collectionsSaga() {
  yield takeLatest(SEND_CREDENTIALS, provisionSaga);
}
