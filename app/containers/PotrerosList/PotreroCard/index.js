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
        
      
        <p><strong>Nombre:</strong> {Nombre}</p>
        <p><strong>Descripción:</strong> {Descripcion}</p>
        <p><strong>Superficie:</strong> {Superficie}</p>
        <p><strong>Calidad:</strong> {Calidad}</p>
         
      
      
      </Card.Body>

      <Card.Footer>
        <Button variant="primary">Entrar</Button>
      </Card.Footer>
    </Card>
  )
}

export default Example
