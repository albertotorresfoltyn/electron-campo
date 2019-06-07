import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { Button, Row, Col, Container } from 'reactstrap';
import DataService from '../services/DataService';
import CampoCard from './CampoCard';
import {
  withRouter
} from 'react-router-dom';

class Home extends Component {
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
          <Container>
            <div className="text-center pt-md-5">
            <h1 className="display-4">CAMPOS</h1>
          </div>
            {
            this.state.campos.map((campo) => <Row key={campo.IdCampo} className="pt-md-5 text-center">
                <Col key={campo.IdCampo} md={{ size: 6, offset: 3 }} className="">
                <CampoCard key={campo.IdCampo} onClick={()=>{this.props.history.push('/potreros/'+campo.IdCampo)}} campo={campo} /></Col>
              </Row>)
          }
          </Container>
        </div>
      </div>
    );
  }
}


export default withRouter(Home);
