/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { ListGroup, ListGroupItem } from 'reactstrap';

const Example = ( {potrero,...props }) => {
  const { Descripcion } = potrero

  return (
    <Card {...props}>
      <Card.Body className="text">
        <ListGroup>
          <ListGroupItem><strong>Descripción:</strong> {Descripcion}</ListGroupItem>
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default Example
