import { ACTIVITY_INVOCATION, SET_FORM_VIEW } from '../actions/sync';
import {
  ACTIVITY_INVOCATION_SUCCESS, ACTIVITY_INVOCATION_ERROR, START_CHILD_ACTIVITY,
  FINISH_CHILD_ACTIVITY, EXIT_CHILD_ACTIVITY, FINISH_UNSCHEDULED_ACTIVITY, UPDATE_TEMPLATE,
  ABORT_UNSCHEDULED_ACTIVITY, SET_FORM_TITLE, SHOW_SERVER_MESSAGE, SAVE_CHILD_ACTIVITY,
  START_UNSCHEDULED_ACTIVITY, UNSCHEDULED_ACTIVITY_SUCCESS, START_CHILD_ACTIVITY_INVOCATION_ERROR,
} from '../actions/activities';
import { FORM, ACTIVITIES, LIST, ACTIVITY_STARTED, ACTIVITY_FINISHED } from '../utils/constants';
// import { store } from '../utils/PersistentStorage';
import { ElectronStore } from '../utils/PersistentStorage';

const initinalState = {
  showing: LIST,
  formTitle: '',
  activityTemplate: null,
  childActivity: null,
  waiting: false,
  error: false,
  message: '',
  selectedUA: null,
};


export default function forms(state = initinalState, action) {
  const childActivities = new ElectronStore({ name: 'child_activities' });
  switch (action.type) {
    case ACTIVITY_INVOCATION: {
      return {
        ...state, waiting: true, error: false, message: '',
      };
    }
    case ACTIVITY_INVOCATION_SUCCESS: {
      // console.log(action);
      return {
        ...state, waiting: false, error: false, message: '',
      };
    }
    case ACTIVITY_INVOCATION_ERROR: {
      return {
        ...state, waiting: false, error: true, message: '',
      };
    }
    case START_UNSCHEDULED_ACTIVITY: {
      return {
        ...state, waiting: true, error: false, message: '',
      };
    }
    case START_CHILD_ACTIVITY: {
      const childActivitiesArray = childActivities.get('child_activities') ? childActivities.get('child_activities') : [];
      const childActivity = {
        activity: action.activity.id,
        childAct: action.childAct,
        parentAct: action.parentAct,
        status: ACTIVITY_STARTED,
        ts: new Date().getTime(),
      };
      childActivitiesArray.push(childActivity);
      childActivities.set('child_activities', childActivitiesArray);
      return {
        ...state, childActivity, waiting: true, error: false, message: '',
      };
    }
    case FINISH_CHILD_ACTIVITY: {
      const childActivitiesArray = childActivities.get('child_activities') ? childActivities.get('child_activities') : [];
      childActivitiesArray.push({
        id: action.activity,
        status: ACTIVITY_FINISHED,
        ts: new Date().getTime(),
      });
      childActivities.set('child_activities', childActivitiesArray);
      return {
        ...state, childActivity: null, showing: ACTIVITIES, waiting: false, error: false, message: '',
      };
    }
    case SAVE_CHILD_ACTIVITY: {
      return {
        ...state, childActivity: null, showing: ACTIVITIES, waiting: false, error: false, message: '',
      };
    }
    case EXIT_CHILD_ACTIVITY: {
      return {
        ...state, childActivity: null, showing: ACTIVITIES, waiting: false, error: false, message: '',
      };
    }
    case FINISH_UNSCHEDULED_ACTIVITY: {
      return {
        ...state,
        childActivity: null,
        formTitle: null,
        activityTemplate: null,
        showing: LIST,
        waiting: false,
        error: false,
        message: '',
      };
    }
    case ABORT_UNSCHEDULED_ACTIVITY: {
      return {
        ...state,
        childActivity: null,
        formTitle: null,
        activityTemplate: null,
        showing: LIST,
        waiting: false,
        error: false,
        message: '',
      };
    }
    case UNSCHEDULED_ACTIVITY_SUCCESS: {
      if (action.response._msg) { // offline behavior
        const { elementToPersist } = action;
        return {
          ...state,
          ...{
            showing: ACTIVITIES,
            activityTemplate: elementToPersist,
            formTitle: elementToPersist.name,
            waiting: false,
            error: false,
            message: '',
          },
        };
      }
      const response = action.response.data.responses.find(r => r.type === 'invocation');
      const activityTemplate = response.buffer.activity_templates.find(t =>
        t.id === response.buffer.root_template);
      activityTemplate.localId = action.elementToPersist.localId;
      return {
        ...state,
        ...{
          showing: ACTIVITIES,
          activityTemplate,
          formTitle: activityTemplate.name,
          waiting: false,
          error: false,
        },
      };

    }
    case START_CHILD_ACTIVITY_INVOCATION_ERROR: {
      // console.log(action);
      return {
        ...state, waiting: false, error: true, message: '',
      };
    }

    case SET_FORM_TITLE: {
      const { formTitle } = action;
      return {
        ...state, formTitle, waiting: false, error: false, message: '',
      };
    }

    case SHOW_SERVER_MESSAGE: {
      return {
        ...state, message: action.message, waiting: false, error: false,
      };
    }

    case UPDATE_TEMPLATE: {
      return {
        ...state, selectedUA: action.template,
      };
    }


    case SET_FORM_VIEW: {
      return {
        ...state,
        ...{
          showing: FORM,
          formObject: action.formObject,
          waiting: false,
          error: false,
          message: '',
        },
      };
    }
    default:
      return { ...state, waiting: false, error: false };
  }
}
