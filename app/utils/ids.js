import { ElectronStore } from '../utils/PersistentStorage';
const store = new ElectronStore({name: 'parameters'});

export function getUnscheduledId () {
  const result = store.get('unscheduledId', 1);
  let newId = result + 1;
  store.set('unscheduledId', newId);
  return result;
}
