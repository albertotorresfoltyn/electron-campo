import React, { Component } from 'react';
import styles from './Leyenda.css';
import DataService from '../../services/DataService';
import {ListGroup, ListGroupItem, Row, Col } from 'reactstrap';


class Leyenda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorias: [],
    };

  }

  componentWillMount() {
    this.setState({ categorias: DataService.getCategoriaHacienda() });
  
  }

  render() {
 
  return (
    <Row>
     
      <ListGroup>

      {this.state.categorias.map(cat => (
            <ListGroupItem className="text-light p-0 m-0 btn-sm" style={{ backgroundColor : cat.Color}}  >{cat.Nombre}</ListGroupItem>

          ))}  
      
       
      </ListGroup>
     
    </Row>
  );
}
}

export default Leyenda
