// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Potrero.css';
import { Button, Row, Col, Container } from 'reactstrap';
import DataService from '../../services/DataService';
import PotreroCard from './PotreroCard';
import {
  withRouter
} from 'react-router-dom';

class PotrerosList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      potreros: [],
    };
  }

  componentWillMount() {
    this.setState({ potreros: DataService.getPotreros(this.props.match.params.campoId) });
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <Container>
            <div className="text-center pt-md-5">
              <h1 className="display-4">POTREROS</h1>
            </div>
            {this.state.potreros.map(potrero => (
              <Row key={potrero.Idpotrero} className="pt-md-5 text-center">
                <Col
                  key={potrero.IdPotrero}
                  md={{ size: 6, offset: 3 }}
                  className=""
                >
                  <PotreroCard potrero = {potrero} onClick={()=>{this.props.history.push('/potreros/'+campo.IdCampo)}}/>
                </Col>{' '}
              </Row>
              ))}
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(PotrerosList)
