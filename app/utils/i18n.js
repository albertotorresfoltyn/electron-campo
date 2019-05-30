import i18next from 'i18next';

i18next
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: 'en', // TODO: Get it from the environment 'en' | 'es'
    // Using simple hardcoded resources for simple example
    resources: {
      en: {
        translation: { // TODO: this should be a json file
          register: { label: 'Register your application.' },
          enter_license: { label: 'Please enter your license information:' },
          license_id: { label: 'License ID' },
          auth_code: { label: 'Authentication Code' },
          acq_license: { label: 'Acquire License' },
          about: { label: 'About this app' },
          need_help: { label: 'Need help?' },
          network_error: { label: 'You have no internet connection. Please connect to the internet and try again' },
          platform_error: { label: 'Unable to connect to the CellTrak service. Please try again or contact support if the problem continues.' },
          platform_wrong_lic: { label: 'The application can only be registered for a CareManager License. Please confirm license information' },
          no_lic: { label: '"License ID" is required' },
          no_auth_code: { label: '"Authentication Code" is required' },
          no_user_id: { label: '"User ID" is required' },
          no_last_name: { label: '"Lastname" is required' },
          wrong_lic_auth: { label: 'The combination of License ID and Authentication Code are not valid. Please confirm registration information.' },
          already_register: { label: 'The user information you entered is already registered on another device. Please contact support for assistance.' },
          invalid_id_lastname: { label: 'Invalid User ID or Last Name. Please confirm and try again' },
          password_doesnt_match_doesnt_match: { label: 'Passwords do not match' },
          np_password: { label: 'Passwords cannot be empty' },
          no_q1: { label: '\'Challenge Question\' required' },
          no_a1: { label: '\'Challenge Answer\' required' },
          no_q2: { label: '\'Challenge Question\' required' },
          no_a2: { label: '\'Challenge Answer\' required' },
          password_doesnt_match_len: { label: 'The password does not meet minimum requirements' },
          challenge: { label: 'Enter Password and Challenge Question Information.' },
          cmfl81_login: { label: 'Password does not meet minimum requirements' },
          login_error_bcrypt: { label: 'There was an internal error decrypting password' },
          cant_login: { label: 'Login error' },
          enter_user_info: { label: 'Register User:' },
          verify: { label: 'Verify' },
          login: { label: 'Login' },
          pwd_too_short: { label: 'Password does not meet minimum requirements' },
          invalid_pwd: { label: 'Invalid Password. Please try again' },
          my_activities: { label: 'My Activities' },
          user_data_went_wrong: { label: 'You have no internet connection. Please connect to the internet and try again.' },
          show_future_visits: { label: 'Show future visits' },
          run_activity: { label: 'Run activity' },
          ACTIVITY_STARTED: { label: 'Started'},
          ACTIVITY_FINISHED: { label: 'Finished'}
        },
      },
      es: {
        translation: {
          register: { label: 'Register your application.' },
          enter_license: { label: 'Please enter your license information:' },
          license_id: { label: 'License ID' },
          auth_code: { label: 'Authentication Code' },
          acq_license: { label: 'Acquire License' },
          about: { label: 'About this app' },
          need_help: { label: 'Need help?' },
        },
      },
    },
  });

export default i18next;
