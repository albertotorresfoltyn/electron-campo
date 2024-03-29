import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import { Button, Row, Col, Container, Jumbotron } from 'reactstrap';

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
        <div data-tid="container ">
        <div className="jumbotron jb">
        <div className="container text-center  text-white">
          <h2 className="display-3">Buenaventura Ñangarekohápe</h2>
          <p>Sistema Administración Ganadera</p>
         
        </div>
      </div>

      
          <Container>
            {
              this.state.campos.map((campo) => 
                <Row key={campo.IdCampo} className="text-center">
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
