
import { fork, all } from 'redux-saga/effects';
import activitiesSagaObject from './activities';
import provisionSagaObject from './provision';
import registerSagaObject from './register';
import syncSagaObject from './sync';
// watcher saga: watches for actions dispatched to the store, starts worker saga
export default function* watcherSaga() {
  yield all([
    fork(provisionSagaObject),
    fork(registerSagaObject),
    fork(syncSagaObject),
    fork(activitiesSagaObject),
  ]);
}
