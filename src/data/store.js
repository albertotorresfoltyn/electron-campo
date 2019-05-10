import { createStore, combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import reducer from './reducer';

const rootReducer = combineReducers({
  reducer,
  router,
});

const store = (initialstate:?rootReducer) => createStore(rootReducer, initialstate);



export default store;
