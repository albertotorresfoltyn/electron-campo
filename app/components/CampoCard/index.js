/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { ListGroup, ListGroupItem } from 'reactstrap';

const Example = ({campo, ...props }) => {
  const { IdCampo, Nombre, Descripcion, Superficie } = campo

  return (
    <Card {...props}>
      <Card.Header tag="h3" className="bg-success text-white">{Nombre}</Card.Header>
      <Card.Body className="text">
        <ListGroup>
          <ListGroupItem><strong>Descripción:</strong> {Descripcion}</ListGroupItem>
          <ListGroupItem><strong>Descripción:</strong> {Descripcion}</ListGroupItem>
          <ListGroupItem><strong>Descripción:</strong> {Descripcion}</ListGroupItem>
          <ListGroupItem><strong>Descripción:</strong> {Descripcion}</ListGroupItem>
          <ListGroupItem><strong>Descripción:</strong> {Descripcion}</ListGroupItem>
        </ListGroup>
      </Card.Body>
      <Card.Footer>
        <Button variant="primary">Entrar</Button>
      </Card.Footer>
    </Card>
  )
}

export default Example
