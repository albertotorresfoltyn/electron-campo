// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Potrero.css';
import { Button, Row, Col, Container, Breadcrumb, BreadcrumbItem, Card, CardBody, CardHeader, CardText } from 'reactstrap';
import DataService from '../../services/DataService';
import PotreroCard from './PotreroCard';
import Estado from '../../components/Estado';
import Leyenda from '../../components/Leyenda';
import {
  withRouter
} from 'react-router-dom';
import { debug } from 'util';

class PotrerosList extends Component {
  constructor(props) {
    super(props);
    this.calcularTotalDetalle = this.calcularTotalDetalle.bind(this);
    
    this.state = {
      potreros: [],
      potrerosResumen : []
    };

  }

  componentWillMount() {
   
    this.setState({ potreros: DataService.getPotreros(this.props.match.params.campoId), potrerosResumen:  this.calcularTotalDetalle (DataService.getDetallePotreros())});
 
  }

  // Calcula el detalle resumen total 
  calcularTotalDetalle (list) {

  
    list.reduce((acc, i)=>{
      var isPresent = acc.find((e)=>{return e.type===i.type});
      if (!isPresent) {
        acc.push(i) //primer valor en la sumarizacion
      } else {
         isPresent.total += i.total; // sumo
         //reemplazo en el arreglo
         var index = acc.findIndex((e)=>{return e.type===i.type});
          if (index !== -1) {
              acc[index] = isPresent;
          }
      }
      return acc;
      }, []);
      console.log(list);
      return list;
     
      
    
  }

  render() {
    return (
      <div>
        
        <Breadcrumb className="text-white bg-dark" ><BreadcrumbItem active >LA EUGENIA</BreadcrumbItem></Breadcrumb>

        <div className={styles.container} data-tid="container">
          <Container fluid className="text-center">
            <Row>
              <Col md="7">
              <Breadcrumb><BreadcrumbItem active>POTREROS</BreadcrumbItem></Breadcrumb>
                 <Row>
                  {this.state.potreros.map(potrero => (
                     <Col md="3">
                    <PotreroCard key={potrero.IdPotrero}  potrero = {potrero} onClick={()=>{this.props.history.push('/potrero/'+potrero.IdPotrero)}}/>
                    </Col>
                  ))}  
                  </Row>
              </Col>

              <Col md="5">
                <Breadcrumb><BreadcrumbItem active>MAPA</BreadcrumbItem></Breadcrumb>
                <img className="mx-auto img-fluid" width="600" height="280" src="../app/assets/img/mapa.png" ></img>
                
                
                <Breadcrumb><BreadcrumbItem active>ESTADO</BreadcrumbItem></Breadcrumb>
                <Row>
                   <Estado key={this.props.match.params.campoId} potreroDetalle={this.state.potrerosResumen} />
                </Row>

                
              </Col>
            </Row>

          </Container>

        </div>
      </div>
    );
  }
}

export default withRouter(PotrerosList)
