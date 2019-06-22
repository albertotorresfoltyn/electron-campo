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
    this.setState({ potrero: DataService.getPotrero(this.props.match.params.potreroId)});
  
  }

  render() {

    const {potrero} = this.state;

    return (
      <div>
        <div  data-tid="container">
        <Breadcrumb className="blueColor"><BreadcrumbItem active>POTRERO {potrero.Nombre} - {potrero.Codigo}</BreadcrumbItem>        </Breadcrumb>

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
                      <span> {potrero.IdPotrero}</span>
                      <span> {potrero.Descripcion}</span>
                    </CardText>
              </Card>
            </Row>

            <Row>
              <Card body outline color="secondary" className="p-3 mb-2">
                <CardTitle><strong>Estado Actual</strong></CardTitle>
                <CardText></CardText>
                    <CardText> 
                    <Estado  key={potrero.Nombre}></Estado>
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
