// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import provision from './provision';
import activities from './activities';

const rootReducer = combineReducers({
  provision,
  activities,
  router,
});

export default rootReducer;
