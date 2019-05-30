

const electron = require('electron');
const path = require('path');

exports.getFilePath = (key) => {
  if (typeof key !== 'string') {
    throw new Error('Invalid Key');
  }

  if (!key.trim()) {
    throw new Error('Invalid Key');
  }

  // Trick to prevent adding the `.json` twice
  // if the key already contains it.
  const fileName = `${path.basename(key, '.json')}.json`;

  // Prevent ENOENT and other similar errors when using
  // reserved characters in Windows filenames.
  // See: https://en.wikipedia.org/wiki/Filename#Reserved%5Fcharacters%5Fand%5Fwords
  const escapedFileName = encodeURIComponent(fileName);

  return path.join(this.getStorageDir(), escapedFileName);
};

exports.getUserDataDir = () => {
  const app = electron.app || (electron.remote && electron.remote.app);

  if (app) {
    return app.getPath('userData');
  }
  return '/tmp/storage';
};

exports.getStorageDir = () => path.join(this.getUserDataDir(), 'storage');

exports.createErrorObject = err => ({
  status: false,
  error: err,
});

exports.createSuccessObject = data => ({
  status: true,
  data,
});
