import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions/sync';

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export class App extends Component {
  render() {
    return (
      <div id="pageWrapper">
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withRouter(connect(() => ({}), mapDispatchToProps)(App));
