import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';

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
