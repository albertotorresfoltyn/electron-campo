import path from 'path';
import electron from 'electron';
import fs from 'fs';
import crypto from 'crypto';
import assert from 'assert';
import EventEmitter from 'events';
import dotProp from 'dot-prop';
import makeDir from 'make-dir';
import pkgUp from 'pkg-up';
import envPaths from 'env-paths';
import writeFileAtomic from 'write-file-atomic';
import os from 'os';
/* eslint-disable no-underscore-dangle */

const plainObject = () => Object.create(null);

// Prevent caching of this module so module.parent is always accurate
delete require.cache[__filename];
const parentDir = path.dirname((module.parent && module.parent.filename) || '.');

class Conf {
  constructor(options) {
    const pkgPath = pkgUp.sync(parentDir);

    let opts = Object.assign(
      {
        // Can't use `require` because of Webpack being annoying:
        // https://github.com/webpack/webpack/issues/196
        projectName:
          pkgPath && JSON.parse(fs.readFileSync(pkgPath, 'utf8')).name,
      },
      options,
    );

    if (!options.projectName && !options.cwd) {
      throw new Error('Project name could not be inferred. Please specify the `projectName` option.');
    }

    opts = Object.assign(
      {
        configName: 'config',
      },
      opts,
    );

    if (!options.cwd) {
      opts.cwd = envPaths(options.projectName).config;
    }

    this.events = new EventEmitter();
    this.encryptionKey = options.encryptionKey;
    this.path = path.resolve(
      opts.cwd,
      `${opts.configName ? opts.configName : 'config'}.json`,
    );
    this.store = Object.assign(plainObject(), opts.defaults, this.store);
  }

  get(key, defaultValue) {
    return dotProp.get(this.store, key, defaultValue);
  }

  set(key, value) {
    if (typeof key !== 'string' && typeof key !== 'object') {
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof key}`);
    }

    if (typeof key !== 'object' && value === undefined) {
      throw new TypeError('Use `delete()` to clear values');
    }

    const { store } = this;

    if (typeof key === 'object') {
      const m = Object.keys(key);
      m.forEach((k) => {
        dotProp.set(store, k, key[k]);
      });
    } else {
      dotProp.set(store, key, value);
    }

    this.store = store;
  }

  has(key) {
    return dotProp.has(this.store, key);
  }

  delete(key) {
    const { store } = this;
    dotProp.delete(store, key);
    this.store = store;
  }

  clear() {
    this.store = plainObject();
  }

  onDidChange(key, callback) {
    if (typeof key !== 'string') {
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof key}`);
    }

    if (typeof callback !== 'function') {
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof callback}`);
    }

    let currentValue = this.get(key);

    const onChange = () => {
      const oldValue = currentValue;
      const newValue = this.get(key);

      try {
        // TODO: Use `util.isDeepStrictEqual` when targeting Node.js 10
        assert.deepEqual(newValue, oldValue);
      } catch (_) {
        currentValue = newValue;
        callback.call(this, newValue, oldValue);
      }
    };

    this.events.on('change', onChange);
    return () => this.events.removeListener('change', onChange);
  }

  get size() {
    return Object.keys(this.store).length;
  }

  get store() {
    try {
      let data = fs.readFileSync(this.path, this.encryptionKey ? null : 'utf8');

      if (this.encryptionKey) {
        try {
          const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
          data = Buffer.concat([decipher.update(data), decipher.final()]);
        } catch (e) {
          // console.log(e);
        }
      }

      return Object.assign(plainObject(), JSON.parse(data));
    } catch (error) {
      if (error.code === 'ENOENT') {
        makeDir.sync(path.dirname(this.path));
        return plainObject();
      }

      if (error.name === 'SyntaxError') {
        return plainObject();
      }

      throw error;
    }
  }

  set store(value) {
    // Ensure the directory exists as it could have been deleted in the meantime
    makeDir.sync(path.dirname(this.path));

    let data = JSON.stringify(value, null, '\t');

    if (this.encryptionKey) {
      const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
      data = Buffer.concat([cipher.update(Buffer.from(data)), cipher.final()]);
    }

    writeFileAtomic.sync(this.path, data);
    this.events.emit('change');
  }

  // TODO: Use `Object.entries()` when targeting Node.js 8
  * [Symbol.iterator]() {
    const { store } = this;
    const keys = Object.keys(store);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      yield [key, store[key]];
    }
  }
}

class ElectronStore extends Conf {
  constructor(opts) {
    const options = Object.assign({ name: 'config' }, opts);
    if ((electron) && (electron.app || electron.remote)){
      const defaultCwd = (electron.app || electron.remote.app).getPath('userData');

      if (opts && opts.cwd) {
        options.cwd = path.isAbsolute(opts.cwd)
          ? opts.cwd
          : path.join(defaultCwd, opts.cwd);
      } else {
        options.cwd = defaultCwd;
      }
    }
    if (!options.cwd) {
      options.cwd = os.tmpdir();
    }
    options.configName = opts && opts.name ? opts.name : null;
    delete options.name;
    super(options);
    this.cache = {};
  }

  openInEditor() {
    electron.shell.openItem(this.path);
  }

  get(key, defaultValue){
    const defaultCacheValue = {isClean: true, isPresent: false}
    const objInCache = dotProp.get(this.cache, key, defaultCacheValue);
    if ((objInCache.isPresent) && (objInCache.isClean)){
      return objInCache.value;
    }
    const returnV = super.get(key, defaultValue);
    dotProp.set(this.cache, key, {isClean: true, isPresent: true, value: returnV});
    return returnV;
  }

  set(key, value){
    //vaery basic implementation... should work
    dotProp.set(this.cache, key, {isClean: true, isPresent: true, value: value});
    return super.set(key, value);
  }
}

class RequestStore extends Conf {
  constructor(opts) {
    const options = Object.assign({
      name: 'request',
      startId: 0,
    }, opts);
    if ((electron) && (electron.app || electron.remote)){
      const defaultCwd = (electron.app || electron.remote.app).getPath('userData');

      if (opts && opts.cwd) {
        options.cwd = path.isAbsolute(opts.cwd)
          ? opts.cwd
          : path.join(defaultCwd, opts.cwd);
      } else {
        options.cwd = defaultCwd;
      }
    }
    options.configName = opts && opts.name ? opts.name : null;
    delete options.name;
    super(options);
    this.startId = options.startId;
  }


  push(key, value) {
    if (typeof key !== 'string' && typeof key !== 'object') {
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof key}`);
    }

    if (typeof key !== 'object' && value === undefined) {
      throw new TypeError('Use `delete()` to clear values');
    }

    // get the store state and start id
    const { store, startId } = this;
    // get the list of requests if any
    const list = dotProp.get(this.store, key);
    // get the last request id from the store or use the start id
    const requestId = dotProp.get(store, 'next_request_id') || startId;
    // check if new list of requests
    if (Array.isArray(list) && list.length > 0) {
      // Add new request to the list
      dotProp.set(store, key, [...list, { ...value, requestId }]);
    } else {
      // create new list of request
      dotProp.set(store, key, [{ ...value, requestId }]);
    }
    // Increment and save last request id
    dotProp.set(store, 'next_request_id', (requestId + 1));
    this.store = store;
  }

  clear(key) {
    if (typeof key !== 'string' && typeof key !== 'object') {
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof key}`);
    }

    const { store } = this;
    dotProp.delete(store, key);
    this.store = store;
  }

  openInEditor() {
    electron.shell.openItem(this.path);
  }
}

class ActivitiesStore extends Conf {
  constructor(opts) {
    const options = Object.assign({
      name: 'activities',
    }, opts);

    if ((electron) && (electron.app || electron.remote)){
      const defaultCwd = (electron.app || electron.remote.app).getPath('userData');

      if (opts && opts.cwd) {
        options.cwd = path.isAbsolute(opts.cwd)
          ? opts.cwd
          : path.join(defaultCwd, opts.cwd);
      } else {
        options.cwd = defaultCwd;
      }
    }

    options.configName = opts && opts.name ? opts.name : null;
    delete options.name;
    super(options);
  }


  push(key, value) {
    if (typeof key !== 'string' && typeof key !== 'object') {
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof key}`);
    }

    if (typeof key !== 'object' && value === undefined) {
      throw new TypeError('Use `delete()` to clear values');
    }

    // get the store state and start id
    const { store } = this;
    // get the list of requests if any
    const list = dotProp.get(this.store, key);
    // check if new list of requests
    if (Array.isArray(list) && list.length > 0) {
      // Add new request to the list
      dotProp.set(store, key, [...list, { ...value }]);
    } else {
      // create new list of request
      dotProp.set(store, key, [{ ...value }]);
    }
    this.store = store;
  }

  clear(key) {
    if (typeof key !== 'string' && typeof key !== 'object') {
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof key}`);
    }

    const { store } = this;
    dotProp.delete(store, key);
    this.store = store;
  }

  openInEditor() {
    electron.shell.openItem(this.path);
  }
}

const electronRemote =
  electron.remote && electron.remote.app ? electron.remote.app : null;
const e = electron.app ? electron.app : electronRemote;

let store;

if (!e) {
  let storage = {};
  store = {
    setInitialState(obj) {
      storage = obj;
    },
    set(key, value) {
      storage[key] = value || '';
    },
    get(key) {
      return key in storage ? storage[key] : null;
    },
    removeItem(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    },
  };
} else {
  store = new ElectronStore();
}

module.exports = {
  store,
  ElectronStore,
  RequestStore,
  ActivitiesStore,
  Conf,
};
