// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import provision from './provision';
import activities from './activities';
import sync from './sync';
import form from './form';

const rootReducer = combineReducers({
  provision,
  sync,
  activities,
  form,
  router,
});

export default rootReducer;
