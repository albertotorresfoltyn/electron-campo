import electron from 'electron';

import {
  ACTIVITIES_UPDATE,
  ACTIVITIES_PERSIST,
  ACTIVITIES_DESTROY,
} from '../actions/activities';

const store = {
  get: () => null,
  set: () => null,
  push: () => null,
  clear: () => null,
};

if (electron && (electron.app || electron.remote.app)) {
  // console.log('ELECTRON');
} else {
  // console.log('NO ELECTRON');
}

export default function activities(state = {}, action) {
  switch (action.type) {
    case ACTIVITIES_UPDATE:
    {
      // console.log('ACTIVITIES_UPDATE', action);
      return { ...state };
    }

    case ACTIVITIES_PERSIST:
    {
      // console.log('ACTIVITIES_PERSIST', action);
      if (Array.isArray(action.activitie)) {
        const tmp = {};
        action.activitie.map((activity) => {
          const { id } = activity;
          store.set(id.toString(), activity);
          tmp[id.toString()] = activity;
          return activity;
        });
        return { ...state, ...tmp };
      }
      return { ...state };
    }

    case ACTIVITIES_DESTROY:
    {
      // console.log('ACTIVITIES_DESTROY', action);
      const tmp = Object.assign({}, state);
      let { id } = action.activity;
      if (typeof id === 'number') {
        id = id.toString();
      }
      action.activitie.map((activity) => {
        store.delete(id.toString());
        delete tmp[id.toString()];
        return activity;
      });

      return tmp;
    }

    default:
      return state;
  }
}
