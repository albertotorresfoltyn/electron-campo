import electron from 'electron';
import { RequestStore, store as MightyStore, ElectronStore } from '../utils/PersistentStorage';
import {
  SYNC_CLEANSE,
  SYNC_REQUEST,
  SYNC_SUCCESS,
  SYNC_FAILURE,
  SYNC_CONNECT,
  SYNC_UPDATES,
  SYNCHRONIZE_STORAGE,
} from '../actions/sync';

import { STORE_TEMPLATES_LOCALLY } from '../actions/activities';

const startId = require('../utils/PersistentStorage').store.get('device_id');

const store = (electron && electron.app) ? new RequestStore({
  name: 'requests',
  start_id: startId,
}) : {
  get: () => null,
  set: () => null,
  push: () => null,
  clear: () => null,
};

const initinalState = {
  provider: 'sync',
  requests: store.get('requests'),
};

function isAnyActivityRunning() {
  let result = false;
  const activitiesStore = new ElectronStore({ name: 'activities' });
  const entries = Object.entries(activitiesStore.store);
  let i = 0;
  while ((i < entries.length) && (!result)) {
    result = result || (entries[i].status !== 'STARTED');
    i++;
  }
  return result;
}

export default function sync(state = initinalState, action) {
  switch (action.type) {
    case SYNC_CLEANSE:
    {
      // console.log('SYNC_CLEANSE', action);
      store.clear('requests');
      return { ...state };
    }

    case SYNC_REQUEST:
    {
      const { request } = action;
      store.push('requests', request);
      const requests = store.get('requests');
      return { ...state, requests };
    }

    case SYNC_SUCCESS:
    {
      // console.log('SYNC_SUCCESS', action);
      return { ...state };
    }

    case SYNC_FAILURE:
    {
      // console.log('SYNC_FAILURE', action);
      return { ...state };
    }

    case SYNC_CONNECT:
    {
      // console.log('SYNC_CONNECT', action);
      const accState = {
        waiting: true,
        message: '',
      };
      const requests = store.get('requests');
      return { ...state, ...accState, requests };
    }

    case SYNC_UPDATES:
    {
      // console.log('SYNC_UPDATES', action);
      const accState = {
        waiting: false,
        message: '',
      };
      // const updates = store.set('updates');
      return { ...state, ...accState };
    }

    case STORE_TEMPLATES_LOCALLY: {
      try {
        const { response } = action;
        const templates = response.data.responses[0].buffer.activity_templates;
        const updatesFromStore = MightyStore.get('updates');
        const config = updatesFromStore.find(u => u.type === 'config');
        const configPosition = updatesFromStore.findIndex(u => u.type === 'config');
        const { buffer } = config;
        if (buffer.activity_templates) {
          const AT = buffer.activity_templates;
          templates.map((template) => {
            const i = AT.findIndex(t => t.id === template.id);
            if (i !== -1) {
              AT[i] = template;
            } else {
              AT.push(template);
            }
            return template;
          });
          config.buffer.activity_templates = AT;
          updatesFromStore[configPosition] = config;
        }
        MightyStore.set('updates', updatesFromStore);
        return { ...state, waiting: false };
      } catch (e) {
        console.log(e);
        return { ...state, waiting: false };
      }
    }

    case SYNCHRONIZE_STORAGE:
    {
      const { response } = action;
      const { updates } = response.data;
      const updatesFromStore = MightyStore.get('updates');
      let updatePosition = -1;
      let configPosition = -1;
      let userPosition = -1;
      try {
        // CMFL-209
        // the following lines can be inside the if
        const scheduleFromStore = updatesFromStore ? updatesFromStore.find((u, i) => {
          if (u.type === 'schedule') {
            updatePosition = i;
          }
          return (u.type === 'schedule');
        }) : { buffer: { persist_activity_templates: [] } };
        let schedules = scheduleFromStore.buffer.persist_activity_templates ?
          scheduleFromStore.buffer.persist_activity_templates : [];
        // the lines before this can be moved inside the next if
        const schedule = updates.find(u => u.type === 'schedule');
        if (schedule) {
          if (schedule.buffer.delete_activity_template_ids) {
            schedules = schedules.filter(item => !schedule.buffer.delete_activity_template_ids.includes(item.id));
          }
          if (schedule.buffer.persist_activity_templates) {
            schedule.buffer.persist_activity_templates.map((item) => {
              const i = schedules.findIndex(originalItem => originalItem.id === item.id);
              if (i !== -1) { // update or add
                schedules[i] = item;
              } else {
                schedules.push(item);
              }
            });
          }
          updatesFromStore[updatePosition].version = schedule.version;
          if (!updatesFromStore[updatePosition].buffer.persist_activity_templates) {
            updatesFromStore[updatePosition].buffer.persist_activity_templates = {}; // ensure it exists
          }
          updatesFromStore[updatePosition].buffer.persist_activity_templates = schedules;
        }

        // CMFL-207
        const config = updates.find(u => u.type === 'config');
        configPosition = updatesFromStore.findIndex(u => u.type === 'config');
        if (config) {
          if (!isAnyActivityRunning()) {
            updatesFromStore[configPosition] = config;
          } else {
            MightyStore.set('configToApply', config);
          }
        }

        // CMFL-208
        const user = updates.find(u => u.type === 'user');
        userPosition = updatesFromStore.findIndex(u => u.type === 'user');
        if (user) {
          if (!isAnyActivityRunning()) {
            updatesFromStore[userPosition] = user;
          } else {
            MightyStore.set('userToApply', user);
          }
        }

        MightyStore.set('updates', updatesFromStore);
      } finally {
        return { ...state, waiting: false };
      }
    }

    default:
      return state;
  }
}
