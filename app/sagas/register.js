import { takeLatest, call, put } from 'redux-saga/effects';
import { SEND_USER_DATA, sendUserDataSuccess, sendUserDataFailure } from '../actions/provision';
import apiX from './api';


export function* registerSaga(action, api = apiX) {
  if ((action.userId) && (action.lastName)) {
    let response;
    try {
      response = yield call(api.register, action);
      if ((response && response.status === 200) && (response.data.responses[0].status_code === 1)) {
        yield put(sendUserDataSuccess(response));
      } else {
        yield put(sendUserDataFailure(response));
      }
    } catch (error) { // If data is null the application will throw exception.
      yield put(sendUserDataFailure(response));
    }
  }
}

export default function* collectionsSaga() {
  yield takeLatest(SEND_USER_DATA, registerSaga);
}
