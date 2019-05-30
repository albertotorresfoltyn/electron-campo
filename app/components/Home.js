// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import Button from 'react-bootstrap/Button'


type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Home</h2>
          <Button variant = "primary" size = "lg" disabled >Primary button </Button>
          <Link to="/concha">to la concha de la madre</Link>
        </div>
      </div>
    );
  }
}
