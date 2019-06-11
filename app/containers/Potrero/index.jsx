// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Button, Row, Col, Container, Breadcrumb, BreadcrumbItem,  Card, CardTitle, CardText  } from 'reactstrap';
import DataService from '../../services/DataService';
import Estado from '../../components/Estado';

import {
  withRouter
} from 'react-router-dom';

class Potrero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      potrero: [],
    };
    
  }

  componentWillMount() {
    console.log(this.props)
    debugger;
    //this.props.match.params.campoId  Mandar tmb esto 
    this.setState({ potrero: DataService.getPotrero(this.props.match.params.potreroId) });
    console.log(this.state.potrero)
  }

  render() {
    return (
      <div>
        <div  data-tid="container">

       

        <Breadcrumb>
          <BreadcrumbItem active>POTRERO   {this.state.potrero[0].Nombre} - {this.state.potrero[0].Codigo}</BreadcrumbItem>
        </Breadcrumb>

        <Container>
          <Row className="mb-3">
            <Button className="mr-1" color="success">Ingreso</Button>{' '}
            <Button className="mr-1" color="success">Egreso</Button>{' '}
            <Button className="mr-1" color="success">Baja</Button>{' '}
            <Button className="mr-1" color="success">Nacimiento</Button>{' '}
          </Row>

            <Row className="">
              <Card body outline color="secondary" className="p-3 mb-2">
                <CardTitle><strong>Resumen</strong></CardTitle>
                <CardText>Aca esta el resumen del potrero</CardText>
                    <CardText> 
                      <span> {this.state.potrero[0].IdPotrero}</span>
                      <span> {this.state.potrero[0].Descripcion}</span>
                    </CardText>
              </Card>
            </Row>

            <Row>
              <Card body outline color="secondary" className="p-3 mb-2">
                <CardTitle><strong>Estado Actual</strong></CardTitle>
                <CardText>Aca esta el estado actual</CardText>
                    <CardText> 
                    <Estado  key={this.state.potrero[0].Nombre}></Estado>
                    </CardText>
              </Card>
            </Row>

            <Row>
              <Card body outline color="secondary" className="p-3 mb-2">
                <CardTitle><strong>Historial</strong></CardTitle>
                <CardText>Aca esta el Historial del potrero</CardText>
                    <CardText> 
                      <span> {this.state.potrero[0].IdPotrero}</span>
                      <span> {this.state.potrero[0].Descripcion}</span>
                    </CardText>
              </Card>
            </Row>
         

            

           
        </Container>

           
          
        </div>
      </div>
    );
  }
}

export default withRouter(Potrero)
