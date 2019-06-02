// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { Button, Row, Col } from 'reactstrap';
import DataService from '../services/DataService';
import CampoCard from './CampoCard'

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campos: [],
    };
  }

  componentWillMount() {
    this.setState({ campos: DataService.getCampos() });
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Home</h2>
          <Col>
            <Row>
              {this.state.campos.map((campo) => {
                return <CampoCard key={campo.IdCampo} campo={campo}/>
              })}
            </Row>
          </Col>
        </div>
      </div>
    );
  }
}
