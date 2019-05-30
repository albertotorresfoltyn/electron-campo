export default class Observable {
  constructor(value) {
    this.listeners = {};
    this.handlers = [];
    this._value = value || undefined;
    this.defaultValue = value || undefined;
    this.valueHasUpdated = false;
  }

  listen(type, handler, scope = this) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push({
      handler,
      scope,
    });
  }

  set value(value) {
    this._value = value;
    this.valueHasUpdated = true;
  }

  get value() {
    return this.valueHasUpdated ? this._value : this._value || this.defaultValue;
  }

  get isDefaultValue() {
    if (Array.isArray(this.defaultValue) && this.defaultValue.length > 1) {
      if (Array.isArray(this._value) && (this._value.length === this.defaultValue.length)) {
        return this._value.every(v => this.defaultValue.includes(v));
      } else {
        return false;
      }
    }
    return this._value && (this._value === this.defaultValue) ? true : false;
  }

  fireEvent(type, data, scope) {
    const listeners = this.listeners[type];

    if (!listeners) {
      return;
    }

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      if (listener.handler.call(scope || listener.scope, type, data) === false) {
        return false;
      }
    }
    return true;
  }
}
