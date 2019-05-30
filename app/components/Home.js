// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { Button } from 'reactstrap';
const path = require('path')
const fs = require('fs')
const SQL = require('sql.js')


export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.doDatabase = this.doDatabase.bind(this);
  }

  doDatabase() { //run sql shit heres
    debugger;
  }
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Home</h2>
          <Button variant = "primary" size = "lg" onClick={this.doDatabase} >Primary button </Button>
          <Link to="/concha">to la concha de la puta madre</Link>
        </div>
      </div>
    );
  }
}
