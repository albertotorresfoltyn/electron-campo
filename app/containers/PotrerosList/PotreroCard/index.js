/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { ListGroup, ListGroupItem } from 'reactstrap';
import CardImg from 'react-bootstrap/CardImg';

const Example = ( {potrero,...props }) => {
  const { Nombre, Descripcion, Superficie, Calidad, Codigo } = potrero

  return (
    <Card {...props}>
      <Card.Header className="bg-sucess text-black"> <h4 className="text-uppercase">{Nombre}</h4>
      </Card.Header>

      <Card.Body className="text">
        
        <ListGroup>
          <ListGroupItem><strong>Nombre:</strong> {Nombre}</ListGroupItem>
          <ListGroupItem><strong>Descripción:</strong> {Descripcion}</ListGroupItem>
          <ListGroupItem><strong>Superficie:</strong> {Superficie}</ListGroupItem>
          <ListGroupItem><strong>Calidad:</strong> {Calidad}</ListGroupItem>
          <ListGroupItem><strong>Codigo:</strong> {Codigo}</ListGroupItem>
        </ListGroup>
      
      </Card.Body>

      <Card.Footer>
        <Button variant="primary">Entrar</Button>
      </Card.Footer>
    </Card>
  )
}

export default Example
