// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Potrero.css';
import { Button, Row, Col, Container, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import DataService from '../../services/DataService';
import PotreroCard from './PotreroCard';
import Estado from '../../components/Estado';
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
        
        <Breadcrumb>
            <BreadcrumbItem active>LA EUGENIA</BreadcrumbItem>
        </Breadcrumb>

        <div className={styles.container} data-tid="container">
          <Container fluid className="text-center">
            <Row>
              <Col md="7">
              <Breadcrumb><BreadcrumbItem active>POTREROS</BreadcrumbItem></Breadcrumb>
                 <Row>
                  {this.state.potreros.map(potrero => (
                     <Col md="3">
                    <PotreroCard potrero = {potrero} onClick={()=>{this.props.history.push('/potrero/'+potrero.IdPotrero)}}/>
                    </Col>
                  ))}  
                  </Row>
              </Col>

              <Col md="5">
                <Breadcrumb><BreadcrumbItem active>MAPA</BreadcrumbItem></Breadcrumb>
                <img className="mx-auto img-fluid" width="600" height="280" src="../app/assets/img/mapa.png" ></img>
                
                
                <Breadcrumb><BreadcrumbItem active>ESTADO</BreadcrumbItem></Breadcrumb>
                <Estado className="mx-auto" ></Estado>


              </Col>
            </Row>

          </Container>

        </div>
      </div>
    );
  }
}

export default withRouter(PotrerosList)
