import axiosX from 'axios';
import os from 'os';
import moment from 'moment-timezone';
import cfg from '../config';
import { store, ElectronStore } from '../utils/PersistentStorage';

const configStore = new ElectronStore({ name: 'parameters' });
// Set user_pin if none exists
if (!store.get('user_pin')) {
  store.set('user_pin', cfg.user_pin);
}

function getActiveUser() {
  const updates = store.get('updates');
  if (!updates) {
    return { type: 'user', version: 0 };
  }
  const user = updates.find(u => u.type === 'user');
  return user.version;
}

function getStoredUser() {
  const user = store.get('userToApply');
  if (!user) {
    return getActiveUser();
  }
  return user.version;
}

function getActiveConfiguration() {
  const updates = store.get('updates');
  if (!updates) {
    return { type: 'config', version: 0 };
  }
  const config = updates.find(u => u.type === 'config');
  return config.version;
}

function getStoredConfiguration() {
  const config = store.get('configToApply');
  if (!config) {
    return getActiveConfiguration();
  }
  return config.version;
}

function getActiveSchedule() {
  const updates = store.get('updates');
  if (!updates) {
    return { type: 'schedule', version: 0 };
  }
  const schedule = updates.find(u => u.type === 'schedule');
  return schedule.version;
}

function getRequestNumber() {
  const response = configStore.get('requestId', 1);
  configStore.set('requestId', response + 1);
  return response;
}


exports.provision = (action, axios = axiosX) => {
  const getServer = (license, config) => config.servers[license.substring(0, 2)];
  let server = getServer(action.license, cfg);
  if (!server) {
    server = getServer(cfg.safeServer, cfg);
  }
  return axios({
    method: 'POST',
    timeout: 200000,
    headers: {
      CT_PROVISION_AUTH: action.auth,
      CT_AUTH: cfg.API_KEY,
      'Content-Type': 'application/json',
    },
    data: {
      common: {
        time: {
          ts: new Date().getTime(),
          tz: moment.tz.guess(),
          src: 'D',
        },
        locale: navigator.language.replace(/-/g, '_'),
        batched: false,
        device_info: {
          os_version: os.release(),
          app_version: '5.8.2',
          phone_number: '',
          imeid: '000000000000000',
          ip_address: 'fe80::d8ab:99ff:fe21:fa51%radio0',
          network_type: 'LTE',
          network_operator: 'Android',
          using_wifi: false,
          roaming: false,
          push_id: '',
          lbs_enabled: true,
        },
      },
      requests: [
        {
          type: 'provision',
          buffer: {
            device_info: {
              platform: 'ANDRD',
              manufacturer: 'Google',
              model: 'Pixel 2',
              hardware_id: 'ranchu',
              package_id: 'com.ctt.celltrak2',
              imeid: '000000000000000',
            },
          },
        },
      ],
    },
    url: `${server}/provision?id=${action.license}`,
  })
    .then(res => res)
    .catch((err) => { console.log(err); return err; });
};
// function that makes the api request and returns a Promise for response
exports.register = (action, axios = axiosX) => {
  const url = `${store.get('url')}/register?siteId=${store.get('site_id')}`;
  const deviceId = store.get('device_id');
  return axios({
    method: 'POST',
    timeout: 200000,
    headers: {
      CT_SITE_AUTH: store.get('site_auth'),
      CT_AUTH: cfg.API_KEY,
      'Content-Type': 'application/json',
    },
    data: {
      common: {
        time: {
          ts: new Date().getTime(),
          tz: moment.tz.guess(),
          src: 'S',
        },
        locale: navigator.language.replace(/-/g, '_'),
        device_id: Number(deviceId),
        versions: {
          license_active: store.get('license_version'),
          license_stored: store.get('license_version'),
        },
        batched: false,
        device_info: {
          os_version: '8.1.0',
          app_version: '5.8.2',
          phone_number: '15555215554',
          imeid: '000000000000000',
          ip_address: 'fe80::a43a:16ff:fe27:baba%radio0',
          network_type: 'LTE',
          network_operator: 'Android',
          using_wifi: false,
          roaming: false,
          push_id: '',
          lbs_enabled: true,
        },
      },
      requests: [
        {
          type: 'register',
          buffer: {
            member_key: action.userId, // '7002',
            member_family_name: action.lastName, // 'Torres',
            user_pin: store.get('user_pin'),
          },
        },
      ],
    },
    url,
  })
    .then(res => res)
    .catch((err) => { console.log(err); return err; });
};

exports.sync = (requests, axios = axiosX) => {
  const url = `${store.get('url')}/sync?siteId=${store.get('site_id')}&deviceId=${store.get('device_id')}`;
  axios.interceptors.response.use(
    response =>
      // intercept the global error
      response
    ,
    (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        // if the error is 401 and hasent already been retried
        originalRequest._retry = true; // now it can be retried
        return exports
          .authenticate()
          .then(/* result */ () => {
            originalRequest.headers.Authorization = `Bearer ${store.get('user_token')}`; // new header new token
            return axios(originalRequest);
          })
          .catch((err) => {
            for (let i = 0; i < error.response.data.errors.length; i += 1) {
              if (err.response.data.errors[i] === 'TOKEN-EXPIRED') {
                auth.logout();
                return;
              }
            }
          });
      }
      if (error.response.status === 404 && !originalRequest._retry) {
        originalRequest._retry = true;
        window.location.href = '/';
        return;
      }
      // Do something with response error
      return Promise.reject(error);
    },
  );

  return axios({
    method: 'POST',
    timeout: 200000,
    headers: {
      CT_SITE_AUTH: store.get('site_auth'),
      CT_AUTH: cfg.API_KEY,
      Authorization: `Bearer ${store.get('user_token')}`,
      'Content-Type': 'application/json',
    },
    data: {
      common: {
        time: {
          ts: new Date().getTime(),
          tz: moment.tz.guess(),
          src: 'S',
        },
        user_member_id: store.get('member_id'),
        locale: navigator.language.replace(/-/g, '_'),
        device_id: store.get('device_id'),
        user_pin: store.get('user_pin'),
        versions: {
          license_active: store.get('license_version'),
          license_stored: store.get('license_version'),
        },
        batched: false,
        device_info: {
          os_version: '8.1.0',
          app_version: '5.8.2',
          phone_number: '15555215554',
          imeid: '000000000000000',
          ip_address: 'fe80::a43a:16ff:fe27:baba%radio0',
          network_type: 'LTE',
          network_operator: 'Android',
          using_wifi: false,
          roaming: false,
          push_id: '',
          lbs_enabled: true,
        },
      },
      requests,
    },
    url,
  })
    .then(response => response)
    .catch(error =>
      // console.error(error);
      error);
};

exports.authenticate = (axios = axiosX) => {
  const deviceId = store.get('device_id');
  const memberId = store.get('member_id');
  const userPin = store.get('user_pin');
  const url = `${store.get('url')}/authenticateDevice?siteId=${store.get('site_id')}&deviceId=${deviceId}`;

  return axios({
    method: 'POST',
    timeout: 200000,
    headers: {
      CT_SITE_AUTH: store.get('site_auth'),
      CT_AUTH: cfg.API_KEY,
      'Content-Type': 'application/json',
    },
    data: {
      member_id: memberId,
      device_id: deviceId,
      user_pin: userPin,
    },
    url,
  })
    .then((response) => {
      store.set('user_token', response.data.user_token);
      return response;
    })
    .catch(error =>
      // console.error(error);
      error);
};

exports.unscheduledActivityInvocation = (action, axios = axiosX) => {
  const deviceId = store.get('device_id');
  const url = `${store.get('url')}/sync?siteId=${store.get('site_id')}&deviceId=${deviceId}`;
  const updates = store.get('updates');
  let config = updates ? updates.find(u => u.type === 'config') : null;
  config = config || { buffer: { form_elements: [], activity_templates: [{ type: 'UPV', id: 1 }] } };
  // const template = action.tpl;// config.buffer.activity_templates.find(t => t.type === 'UPV');
  const { buffer: { form_elements } } = config;
  const patientSearchBy = 'patnt_search_by';
  const memberKeyPatient = '__member_key_PATNT__';
  const memberNamePatient = '__member_name_PATNT__';
  const patientLookupWidget = 'patnt_lookup_widget';
  let r1 = form_elements.find(fe => fe.key === patientSearchBy);
  r1 = r1 || { id: 1 };
  let r2 = form_elements.find(fe => fe.key === memberKeyPatient);
  r2 = r2 || { id: 1 };
  let r3 = form_elements.find(fe => fe.key === memberNamePatient);
  r3 = r3 || { id: 1 };
  let parentWdgt = form_elements.find(fe => fe.key === patientLookupWidget);
  parentWdgt = parentWdgt || { id: 1 };
  axios.interceptors.response.use(
    response =>
      // intercept the global error
      response
    ,
    (error) => {
      const originalRequest = error.config;
      if (!error.response) return Promise.resolve({ _msg: 'NO_CONN' });
      if (error.response.status === 401 && !originalRequest._retry) {
        // if the error is 401 and hasent already been retried
        originalRequest._retry = true; // now it can be retried
        return exports
          .authenticate()
          .then(/* result */ () => {
            originalRequest.headers.Authorization = `Bearer ${store.get('user_token')}`; // new header new token
            return axios(originalRequest);
          })
          .catch((err) => {
            for (let i = 0; i < error.response.data.errors.length; i += 1) {
              if (err.response.data.errors[i] === 'TOKEN-EXPIRED') {
                auth.logout();
                return;
              }
            }
          });
      }
      if (error.response.status === 404 && !originalRequest._retry) {
        originalRequest._retry = true;
        window.location.href = '/';
        return;
      }
      // Do something with response error
      return Promise.reject(error);
    },
  );
  return axios({
    method: 'POST',
    timeout: 200000,
    headers: {
      CT_SITE_AUTH: store.get('site_auth'),
      CT_AUTH: cfg.API_KEY,
      Authorization: `Bearer ${store.get('user_token')}`,
      'Content-Type': 'application/json',
    },
    data: {
      common: {
        time: {
          ts: new Date().getTime(),
          tz: moment.tz.guess(),
          src: 'S',
        },
        locale: navigator.language.replace(/-/g, '_'),
        device_id: store.get('device_id'),
        user_member_id: store.get('member_id'),
        versions: {
          license_active: store.get('license_version'),
          license_stored: store.get('license_version'),
          user_active: getActiveUser(),
          user_stored: getStoredUser(),
          config_active: getActiveConfiguration(),
          config_stored: getStoredConfiguration(),
          schedule_active: getActiveSchedule(),
          schedule_stored: getActiveSchedule(),
          member_lookup_active: '0',
        },
        batched: false,
        device_info: {
          os_version: '8.1.0',
          app_version: '5.8.2',
          phone_number: '',
          ip_address: 'fe80::145a:8453:4535:785d%rmnet_data6',
          network_type: 'LTE',
          network_operator: 'Verizon Wireless',
          using_wifi: true,
          roaming: false,
          push_id: 'cS-7u--A6ww:APA91bFD4FvAeVI2oZER9hl9vYyaCJ-KwX1Xi3rhvdEXYikOegYAI4KZbJMywzXR94dwM8lN6jmJs5Yfo-NHmeYNpK-vJHvcqr2DhexwSBXO4V3qr7-TY3eFsBjPMlV8Y5b3sb46NhDt',
          lbs_enabled: false,
        },
      },
      requests: [
        {
          type: 'invocation',
          versions: {
            license_active: store.get('license_version'),
            user: getActiveUser(),
            config: getActiveConfiguration(),
            schedule: getActiveSchedule(),
            member_lookup: '0',
          },
          buffer: {
            template: action.tpl,
            form_responses: [
              {
                key: patientSearchBy,
                response: [
                  '1',
                ],
                widget: r1.widget,
                form: r1.id,
                parent_form: parentWdgt.id,
                screen: 'invoc',
              },
              {
                key: memberKeyPatient,
                response: [
                  action.userId, // p1
                ],
                widget: r2.widget,
                form: r2.id,
                parent_form: parentWdgt.id,
                screen: 'invoc',
              },
              {
                key: memberNamePatient,
                response: [
                  action.user, // 'QA',
                ],
                widget: r3.widget,
                form: r3.id,
                parent_form: parentWdgt.id,
                screen: 'invoc',
              },
            ],
          },
        },
      ],
    },
    url,
  }).then(res => res)
    .catch((err) => { console.log(err); return err; });
};

exports.startUnscheduledActivity = (action, axios = axiosX) => {
  const deviceId = store.get('device_id');
  const url = `${store.get('url')}/sync?siteId=${store.get('site_id')}&deviceId=${deviceId}`;
  const rootTemplate = action.response.data.responses[0].buffer.root_template;
  const serviceLocation = action.response.data.responses[0].buffer.activity_templates.find(at => at.id === rootTemplate).service_locations[0].id;
  debugger;
  axios.interceptors.response.use(
    response =>
      // intercept the global error
      response
    ,
    (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        // if the error is 401 and hasent already been retried
        originalRequest._retry = true; // now it can be retried
        return exports
          .authenticate()
          .then(/* result */ () => {
            originalRequest.headers.Authorization = `Bearer ${store.get('user_token')}`; // new header new token
            return axios(originalRequest);
          })
          .catch((err) => {
            for (let i = 0; i < error.response.data.errors.length; i += 1) {
              if (err.response.data.errors[i] === 'TOKEN-EXPIRED') {
                auth.logout();
                return;
              }
            }
          });
      }
      if (error.response.status === 404 && !originalRequest._retry) {
        originalRequest._retry = true;
        window.location.href = '/';
        return;
      }
      // Do something with response error
      return Promise.reject(error);
    },
  );
  return axios({
    method: 'POST',
    timeout: 200000,
    headers: {
      CT_SITE_AUTH: store.get('site_auth'),
      CT_AUTH: cfg.API_KEY,
      Authorization: `Bearer ${store.get('user_token')}`,
      'Content-Type': 'application/json',
    },
    data: {
      common: {
        time: {
          ts: new Date().getTime(),
          tz: moment.tz.guess(),
          src: 'S',
        },
        locale: navigator.language.replace(/-/g, '_'),
        device_id: store.get('device_id'),
        user_member_id: store.get('member_id'),
        versions: {
          license_active: store.get('license_version'),
          license_stored: store.get('license_version'),
          user_active: getActiveUser(),
          user_stored: getStoredUser(),
          config_active: getActiveConfiguration(),
          config_stored: getStoredConfiguration(),
          schedule_active: getActiveSchedule(),
          schedule_stored: getActiveSchedule(),
          member_lookup_active: '0',
        },
        batched: false,
        device_info: {
          os_version: '8.1.0',
          app_version: '5.8.2',
          phone_number: '',
          ip_address: 'fe80::145a:8453:4535:785d%rmnet_data6',
          network_type: 'LTE',
          network_operator: 'Verizon Wireless',
          using_wifi: true,
          roaming: false,
          push_id: 'cS-7u--A6ww:APA91bFD4FvAeVI2oZER9hl9vYyaCJ-KwX1Xi3rhvdEXYikOegYAI4KZbJMywzXR94dwM8lN6jmJs5Yfo-NHmeYNpK-vJHvcqr2DhexwSBXO4V3qr7-TY3eFsBjPMlV8Y5b3sb46NhDt',
          lbs_enabled: false,
        },
      },
      requests: [
        {
          request_id: getRequestNumber(),
          type: 'event',
          versions: {
            license_active: store.get('license_version'),
            user: getActiveUser(),
            config: getActiveConfiguration(),
            schedule: getActiveSchedule(),
            member_lookup: '0',
          },
          buffer: {
            event: 'start',
            time: {
              ts: new Date().getTime(),
              tz: moment.tz.guess(),
              src: 'S',
            },
            odt: 0,
            odm: 0,
            activity: action.elementToPersist.localId,
            template: rootTemplate,
            on_device_warning_results: 0,
            service_location: serviceLocation,
            workgroup: 1,
            form_responses: [
              {
                key: '__member_key_PATNT__',
                response: [
                  '25734092',
                ],
                widget: 'text',
                form: 13,
                parent_form: 7063,
                screen: 'invoc',
              },
              {
                key: '__member_name_PATNT__',
                response: [
                  'QA',
                ],
                widget: 'text',
                form: 14,
                parent_form: 7063,
                screen: 'invoc',
              },
              {
                key: 'patnt_search_by',
                response: [
                  '1',
                ],
                widget: 'radio',
                form: 7064,
                parent_form: 7063,
                screen: 'invoc',
              },
            ],
          },
        },
      ],
    },
    url,
  }).then(res => res)
    .catch((err) => { console.log(err); return err; });
};

exports.startChildActivity = (actvt, axios = axiosX) => {
  const deviceId = store.get('device_id');
  const url = `${store.get('url')}/sync?siteId=${store.get('site_id')}&deviceId=${deviceId}`;
  axios.interceptors.response.use(
    response =>
      // intercept the global error
      response
    ,
    (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        // if the error is 401 and hasent already been retried
        originalRequest._retry = true; // now it can be retried
        return exports
          .authenticate()
          .then(/* result */ () => {
            originalRequest.headers.Authorization = `Bearer ${store.get('user_token')}`; // new header new token
            return axios(originalRequest);
          })
          .catch((err) => {
            for (let i = 0; i < error.response.data.errors.length; i += 1) {
              if (err.response.data.errors[i] === 'TOKEN-EXPIRED') {
                auth.logout();
                return;
              }
            }
          });
      }
      if (error.response.status === 404 && !originalRequest._retry) {
        originalRequest._retry = true;
        window.location.href = '/';
        return;
      }
      // Do something with response error
      return Promise.reject(error);
    },
  );
  return axios({
    method: 'POST',
    timeout: 200000,
    headers: {
      CT_SITE_AUTH: store.get('site_auth'),
      CT_AUTH: cfg.API_KEY,
      Authorization: `Bearer ${store.get('user_token')}`,
      'Content-Type': 'application/json',
    },
    data: {
      common: {
        time: {
          ts: new Date().getTime(),
          tz: moment.tz.guess(),
          src: 'S',
        },
        locale: navigator.language.replace(/-/g, '_'),
        user_member_id: store.get('member_id'),
        device_id: store.get('device_id'),
        user_pin: store.get('user_pin'),
        versions: {
          license_active: store.get('license_version'),
          license_stored: store.get('license_version'),
          user_active: getActiveUser(),
          user_stored: getStoredUser(),
          config_active: getActiveConfiguration(),
          config_stored: getStoredConfiguration(),
          schedule_active: getActiveSchedule(),
          schedule_stored: getActiveSchedule(),
          member_lookup_active: '0',
        },
        batched: false,
        device_info: {
          os_version: '8.1.0',
          app_version: '5.8.2',
          phone_number: '',
          ip_address: 'fe80::145a:8453:4535:785d%rmnet_data6',
          network_type: 'LTE',
          network_operator: 'Verizon Wireless',
          using_wifi: true,
          roaming: false,
          push_id: 'cS-7u--A6ww:APA91bFD4FvAeVI2oZER9hl9vYyaCJ-KwX1Xi3rhvdEXYikOegYAI4KZbJMywzXR94dwM8lN6jmJs5Yfo-NHmeYNpK-vJHvcqr2DhexwSBXO4V3qr7-TY3eFsBjPMlV8Y5b3sb46NhDt',
          lbs_enabled: false,
        },
      },
      requests: [
        {
          request_id: getRequestNumber(),
          type: 'event',
          versions: {
            license_active: store.get('license_version'),
            user: getActiveUser(),
            config: getActiveConfiguration(),
            schedule: getActiveSchedule(),
            member_lookup: '0',
          },
          buffer: {
            event: 'start',
            time: {
              ts: new Date().getTime(),
              tz: moment.tz.guess(),
              src: 'S',
            },
            activity: actvt.childAct,
            parent_activity: actvt.parentAct,
            template: actvt.activity.id,
            workgroup: actvt.activity.workgroups[0],
          },
        },
      ],
    },
    url,
  }).then(res => res)
    .catch((err) => { console.log(err); return err; });
};

exports.saveChildActivity = (activity, axios = axiosX) => {
  const { activity: formGenerator } = activity;
  const deviceId = store.get('device_id');
  const url = `${store.get('url')}/sync?siteId=${store.get('site_id')}&deviceId=${deviceId}`;
  axios.interceptors.response.use(
    response =>
      // intercept the global error
      response
    ,
    (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        // if the error is 401 and hasent already been retried
        originalRequest._retry = true; // now it can be retried
        return exports
          .authenticate()
          .then(/* result */ () => {
            originalRequest.headers.Authorization = `Bearer ${store.get('user_token')}`; // new header new token
            return axios(originalRequest);
          })
          .catch((err) => {
            for (let i = 0; i < error.response.data.errors.length; i += 1) {
              if (err.response.data.errors[i] === 'TOKEN-EXPIRED') {
                auth.logout();
                return;
              }
            }
          });
      }
      if (error.response.status === 404 && !originalRequest._retry) {
        originalRequest._retry = true;
        window.location.href = '/';
        return;
      }
      // Do something with response error
      return Promise.reject(error);
    },
  );
  return axios({
    method: 'POST',
    timeout: 200000,
    headers: {
      CT_SITE_AUTH: store.get('site_auth'),
      CT_AUTH: cfg.API_KEY,
      Authorization: `Bearer ${store.get('user_token')}`,
      'Content-Type': 'application/json',
    },
    data: {
      common: {
        time: {
          ts: new Date().getTime(),
          tz: moment.tz.guess(),
          src: 'S',
        },
        locale: navigator.language.replace(/-/g, '_'),
        user_member_id: store.get('member_id'),
        device_id: store.get('device_id'),
        user_pin: store.get('user_pin'),
        versions: {
          license_active: store.get('license_version'),
          license_stored: store.get('license_version'),
          user_active: getActiveUser(),
          user_stored: getStoredUser(),
          config_active: getActiveConfiguration(),
          config_stored: getStoredConfiguration(),
          schedule_active: getActiveSchedule(),
          schedule_stored: getActiveSchedule(),
          member_lookup_active: '0',
        },
        batched: false,
        device_info: {
          os_version: '8.1.0',
          app_version: '5.8.2',
          phone_number: '',
          ip_address: 'fe80::145a:8453:4535:785d%rmnet_data6',
          network_type: 'LTE',
          network_operator: 'Verizon Wireless',
          using_wifi: true,
          roaming: false,
          push_id: 'cS-7u--A6ww:APA91bFD4FvAeVI2oZER9hl9vYyaCJ-KwX1Xi3rhvdEXYikOegYAI4KZbJMywzXR94dwM8lN6jmJs5Yfo-NHmeYNpK-vJHvcqr2DhexwSBXO4V3qr7-TY3eFsBjPMlV8Y5b3sb46NhDt',
          lbs_enabled: false,
        },
      },
      requests: [
        {
          request_id: getRequestNumber(),
          type: 'event',
          versions: {
            license_active: store.get('license_version'),
            user: getActiveUser(),
            config: getActiveConfiguration(),
            schedule: getActiveSchedule(),
            member_lookup: '0',
          },
          buffer: {
            event: 'save',
            time: {
              ts: new Date().getTime(),
              tz: moment.tz.guess(),
              src: 'S',
            },
            activity: activity.childAct.childAct,
            parent_activity: activity.childAct.parentAct,
            template: activity.childAct.activity,
            workgroup: activity.actObj.workgroups[0],
            form_responses: formGenerator.getFormResponses(),
          },
        },
      ],
    },
    url,
  }).then(res => res)
    .catch((err) => { console.log(err); return err; });
};
exports.syncRequests = (request, axios = axiosX) => {
  const reqToSend = {
    request_id: getRequestNumber(),
    type: 'event',
    versions: {
      license_active: store.get('license_version'),
      user: getActiveUser(),
      config: getActiveConfiguration(),
      schedule: getActiveSchedule(),
      member_lookup: '0',
    },
    buffer: request,
  };
  const deviceId = store.get('device_id');
  const url = `${store.get('url')}/sync?siteId=${store.get('site_id')}&deviceId=${deviceId}`;
  axios.interceptors.response.use(
    response =>
      // intercept the global error
      response
    ,
    (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        // if the error is 401 and hasent already been retried
        originalRequest._retry = true; // now it can be retried
        return exports
          .authenticate()
          .then(/* result */ () => {
            originalRequest.headers.Authorization = `Bearer ${store.get('user_token')}`; // new header new token
            return axios(originalRequest);
          })
          .catch((err) => {
            for (let i = 0; i < error.response.data.errors.length; i += 1) {
              if (err.response.data.errors[i] === 'TOKEN-EXPIRED') {
                auth.logout();
                return;
              }
            }
          });
      }
      if (error.response.status === 404 && !originalRequest._retry) {
        originalRequest._retry = true;
        window.location.href = '/';
        return;
      }
      // Do something with response error
      return Promise.reject(error);
    },
  );
  return axios({
    method: 'POST',
    timeout: 200000,
    headers: {
      CT_SITE_AUTH: store.get('site_auth'),
      CT_AUTH: cfg.API_KEY,
      Authorization: `Bearer ${store.get('user_token')}`,
      'Content-Type': 'application/json',
    },
    data: {
      common: {
        time: {
          ts: new Date().getTime(),
          tz: moment.tz.guess(),
          src: 'S',
        },
        locale: navigator.language.replace(/-/g, '_'),
        user_member_id: store.get('member_id'),
        device_id: store.get('device_id'),
        user_pin: store.get('user_pin'),
        versions: {
          license_active: store.get('license_version'),
          license_stored: store.get('license_version'),
          user_active: getActiveUser(),
          user_stored: getStoredUser(),
          config_active: getActiveConfiguration(),
          config_stored: getStoredConfiguration(),
          schedule_active: getActiveSchedule(),
          schedule_stored: getActiveSchedule(),
          member_lookup_active: '0',
        },
        batched: false,
        device_info: {
          os_version: '8.1.0',
          app_version: '5.8.2',
          phone_number: '',
          ip_address: 'fe80::145a:8453:4535:785d%rmnet_data6',
          network_type: 'LTE',
          network_operator: 'Verizon Wireless',
          using_wifi: true,
          roaming: false,
          push_id: 'cS-7u--A6ww:APA91bFD4FvAeVI2oZER9hl9vYyaCJ-KwX1Xi3rhvdEXYikOegYAI4KZbJMywzXR94dwM8lN6jmJs5Yfo-NHmeYNpK-vJHvcqr2DhexwSBXO4V3qr7-TY3eFsBjPMlV8Y5b3sb46NhDt',
          lbs_enabled: false,
        },
      },
      requests: [reqToSend],
    },
    url,
  }).then(res => res)
    .catch((err) => { console.log(err); return err; });
};
window.authenticate = exports.authenticate;
