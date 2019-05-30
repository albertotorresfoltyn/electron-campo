import React, { Component } from 'react';
import { Provider } from 'react-redux';
import bcrypt from 'bcryptjs';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';
import { store } from '../utils/PersistentStorage';

// if the salt has been initialized, use it. Otherwise, create it
if (!store.get('salt')) {
  store.set('salt', `${bcrypt.genSaltSync(5)}`);
}
export default class Root extends Component {
  render() {
    return (
      <Provider {...this.props}>
        <ConnectedRouter {...this.props}>
          <Routes />
        </ConnectedRouter>
      </Provider>
    );
  }
}
