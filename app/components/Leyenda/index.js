import React, { PureComponent } from 'react';
import styles from './Leyenda.css';
import {ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
const leyenda = () => {
 
  return (
    <Row>
     
      <ListGroup>
        <ListGroupItem className="bg-primary text-light p-0 m-0 btn-sm">categoria 1</ListGroupItem>
        <ListGroupItem className="bg-success text-light p-0 m-0 btn-sm"> cat 2</ListGroupItem>
        <ListGroupItem className="bg-info text-light p-0 m-0" >cat 3</ListGroupItem>
        <ListGroupItem className="bg-danger text-light p-0 m-0">cat 4</ListGroupItem>
        <ListGroupItem className="bg-warning text-light p-0 m-0">cat 5</ListGroupItem>
      </ListGroup>
     
    </Row>
    
  
  )
}

export default leyenda
