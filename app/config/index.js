const ENV = process.env.NODE_ENV || 'development';
function makeid(lenght) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < lenght; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export default {
  development: {
    minPwLen: 8,
    API_KEY: '%0K-r6i5S026;R#xcX7o?5!LwS09.&a-Ilxw^syQeul&7P1^3-',
    servers: {
      10: 'https://ct2xprovision.celltrak.net:10443',
      11: 'https://provision-stg.celltrak.net',
      12: 'https://ct2x-demo-provision.celltrak.net:10443',
      20: 'https://provision.celltrak.net',
      21: 'https://provision.celltrak.net',
      22: 'https://provision.celltrak.ca',
      23: 'https://provision.celltrak.ca',
      24: 'https://provision.celltrak.uk.com',
      25: 'https://provision.celltrak.uk.com',
      99: 'http://provision.celltrak.local',
    },
    safeServer: '110123',
    syncInterval: 1000 * 60 * 15,
    user_pin: makeid(128),
  },
  production: {
    minPwLen: 8,
    API_KEY: '%0K-r6i5S026;R#xcX7o?5!LwS09.&a-Ilxw^syQeul&7P1^3-',
    servers: {
      10: 'https://ct2xprovision.celltrak.net:10443',
      11: 'https://provision-stg.celltrak.net',
      12: 'https://ct2x-demo-provision.celltrak.net:10443',
      20: 'https://provision.celltrak.net',
      21: 'https://provision.celltrak.net',
      22: 'https://provision.celltrak.ca',
      23: 'https://provision.celltrak.ca',
      24: 'https://provision.celltrak.uk.com',
      25: 'https://provision.celltrak.uk.com',
      99: 'http://provision.celltrak.local',
    },
    safeServer: '110123',
    syncInterval: 1000 * 60 * 15,
    user_pin: makeid(128),
  },
  test: {
    minPwLen: 8,
    API_KEY: '%0K-r6i5S026;R#xcX7o?5!LwS09.&a-Ilxw^syQeul&7P1^3-',
    servers: {
      10: 'https://ct2xprovision.celltrak.net:10443',
      11: 'https://provision-stg.celltrak.net',
      12: 'https://ct2x-demo-provision.celltrak.net:10443',
      20: 'https://provision.celltrak.net',
      21: 'https://provision.celltrak.net',
      22: 'https://provision.celltrak.ca',
      23: 'https://provision.celltrak.ca',
      24: 'https://provision.celltrak.uk.com',
      25: 'https://provision.celltrak.uk.com',
      99: 'http://provision.celltrak.local',
    },
    safeServer: '110123',
    syncInterval: 1000 * 60 * 15,
    user_pin: makeid(128),
  },
}[ENV];

