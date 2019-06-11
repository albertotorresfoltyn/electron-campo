/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { ListGroup, ListGroupItem } from 'reactstrap';

const Example = ({campo, ...props }) => {
  const { IdCampo, Nombre, Descripcion, Superficie, Total } = campo

  return (
    <Card {...props}>
      <Card.Header  className="bg-success text-white"> <h2 className="text-uppercase">{Nombre}</h2></Card.Header>
      <Card.Body className="text">
        <ListGroup>
          <ListGroupItem><strong>Nombre:</strong> {Nombre}</ListGroupItem>
          <ListGroupItem><strong>Descripción:</strong> {Descripcion}</ListGroupItem>
          <ListGroupItem><strong>Superficie:</strong> {Superficie}</ListGroupItem>
          <ListGroupItem><strong>Cantidad de Potreros:</strong> {Total}</ListGroupItem>
          
        </ListGroup>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary">Entrar</Button>
      </Card.Footer>
    </Card>
  )
}

export default Example
