import {
  SEND_CREDENTIALS, PROVISION_FAILURE,
  PROVISION_SUCCESS, SEND_USER_DATA_SUCCESS, SEND_USER_DATA_FAILURE,
  STORE_AUTH_DATA, LOGIN_ATTEMPT, SEND_USER_DATA,
} from '../actions/provision';
import cfg from '../config';

const initinalState = {
  data: null,
  config: null,
  message: '',
  success: true,
  securityAlreadySetup: false,
  waiting: false,
  auth: {
    auth: false,
  },
};

function networkHasFailed(action) {
  return !action.response || action.response.message === 'Network Error';
}

function platformFailed(action) {
  return action.response && action.response.status !== 200;
}

function wrongAuthOrLicense(action) {
  return action.response && action.response.status === 200 &&
   (action.response.data.responses[0].status_code === 1002 ||
    action.response.data.responses[0].status_code === 1003);
}

function dataIsNotValid(action) {
  return action.response && action.response.status === 200 &&
   action.response.data.responses[0].status_code === 1070;
}

function userIsAlreadyRegistered(action) {
  return action.response && action.response.status === 200 &&
   action.response.data.responses[0].status_code === 1091;
}

function allChecksAreValid(action, passwordEquality, isValidPassword) {
  return action.originalPassword && action.firstQuestion &&
   passwordEquality && isValidPassword &&
    action.firstAnswer && action.secondQuestion && action.secondAnswer;
}

function completeRegistration(action, state) {
  const salt = store.get('salt');
  const hash = bcrypt.hashSync(action.originalPassword, salt);
  const appAuth = {
    auth: hash,
    security1: action.firstQuestion,
    security1a: action.firstAnswer,
    security2: action.secondQuestion,
    security2a: action.secondAnswer,
  };
  store.set('app_auth', appAuth);
  return {
    ...state,
    ...{
      securityAlreadySetup: true,
      success: true,
      message: '',
      app_auth: appAuth,
    },
  };
}

export default function provision(state = initinalState, action) {
  switch (action.type) {
    case SEND_CREDENTIALS:
    {
      const notAuthCode = !action.auth;
      const notLicense = !action.license;
      const accState = {
        waiting: true,
        message: '',
      };

      accState.authMessage = notAuthCode ? 'no_auth_code.label' : '';

      accState.licenseMessage = notLicense ? 'no_lic.label' : '';
      if (notLicense || notAuthCode) {
        accState.waiting = false;
      }
      return {
        ...state,
        ...accState,
      };
    }

    case PROVISION_SUCCESS:
      // console.log('PROVISION_SUCCESS', action.response);
      store.set('auth', action.response.data.responses[0].buffer.auth);
      store.set('url', action.response.data.responses[0].buffer.url);
      store.set('device_id', action.response.data.responses[0].buffer.device_id);
      store.set('site_id', action.response.data.responses[0].buffer.site_id);
      store.set('site_auth', action.response.data.responses[0].buffer.auth);
      store.set('license_version', action.response.data.responses[0].buffer.license_version);
      return {
        ...state,
        ...{
          authMessage: '',
          licenseMessage: '',
          data: action.response.data,
          success: true,
          waiting: false,
          message: '',
          config: action.response.config,
        },
      };

    case PROVISION_FAILURE:
      if (networkHasFailed(action)) {
        return {
          ...state,
          ...{
            waiting: false,
            success: false,
            message: 'network_error.label',
          },
        };
      } else if (platformFailed(action)) {
        return {
          ...state,
          ...{
            waiting: false,
            success: false,
            message: 'platform_error.label',
          },
        };
      } else if (wrongAuthOrLicense(action)) {
        return {
          ...state,
          ...{
            waiting: false,
            success: false,
            message: 'wrong_lic_auth.label',
          },
        };
      }

      return state;

    case SEND_USER_DATA:
    {
      const accState = {
        message: '',
        waiting: true,
      };
      accState.messageUserID = !action.userId ? 'no_user_id.label' : '';
      accState.messageLastName = !action.lastName ? 'no_last_name.label' : '';

      if (accState.messageLastName || accState.messageUserID) {
        accState.waiting = false;
        accState.message = '';
      }

      return {
        ...state,
        ...accState,
      };
    }

    case SEND_USER_DATA_FAILURE:
    {
      let accState = {
        waiting: false,
        messageUserID: '',
        messageLastName: '',
        message: 'user_data_went_wrong.label',
      };

      if (dataIsNotValid(action)) {
        accState = {
          ...accState,
          ...{
            success: false,
            message: 'invalid_id_lastname.label',
          },
        };
      } else if (userIsAlreadyRegistered(action)) {
        accState = {
          ...accState,
          ...{
            success: false,
            message: 'already_register.label',
          },
        };
      }

      return {
        ...state,
        ...accState,
      };
    }

    case SEND_USER_DATA_SUCCESS:
    {
      // console.log('SEND_USER_DATA_SUCCESS', action.response);
      const accState = {
        waiting: false,
        message: '',
      };
      store.set('updates', action.response.data.updates);
      store.set('name', action.response.data.responses[0].buffer.name);
      store.set('member_id', action.response.data.responses[0].buffer.member_id);
      try {
        store.set('user_token', action.response.data.responses[0].buffer.user_token);
      } catch (error) {
        store.set('user_token', null);
      }
      return {
        ...state,
        ...accState,
      };
    }

    case STORE_AUTH_DATA:
    {
      const accState = {
        waiting: true,
      };
      accState.originalPasswordMessage = !action.originalPassword ? 'np_password.label' : '';
      accState.firstQuestionMessage = !action.firstQuestion ? 'no_q1.label' : '';
      accState.firstAnswerMessage = !action.firstAnswer ? 'no_a1.label' : '';
      accState.secondQuestionMessage = !action.secondQuestion ? 'no_q2.label' : '';
      accState.secondAnswerMessage = !action.secondAnswer ? 'no_a2.label' : '';
      const passwordEquality = action.originalPassword === action.passwordCopy;
      accState.secondPasswordMessage = !passwordEquality ? 'password_doesnt_match_doesnt_match.label' : '';
      const isValidPassword = () => true;
      accState.message = !isValidPassword ? 'cmfl81_login.label' : '';
      accState.message = ((!action.originalPassword) || (action.originalPassword.length < cfg.minPwLen)) ? 'pwd_too_short.label' : '';

      if (allChecksAreValid(action, passwordEquality, isValidPassword)) {
        return completeRegistration(action, state);
      }

      return {
        ...state,
        ...accState,
      };
    }

    case LOGIN_ATTEMPT:
    {
      const appAuth = store.get('app_auth');
      const st = bcrypt.compareSync(action.password, appAuth.auth);
      const msg = st ? '' : 'invalid_pwd.label';
      return {
        ...state,
        ...{
          message: msg,
          auth: {
            auth: st,
          },
        },
      };
    }

    default:
      return state;
  }
}
