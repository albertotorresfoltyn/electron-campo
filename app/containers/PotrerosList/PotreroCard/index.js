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
    <Card {...props} className="mb-2">
      <Card.Header className="bg-primary text-white p-0 m-0"> <span className="text-uppercase">{Nombre}</span>
      </Card.Header>

      <Card.Body className="text p-1">
        <p> {Superficie}<strong> ha</strong></p>
        <p> 150<strong> cabezas</strong></p>
      </Card.Body>
    </Card>
  )
}

export default Example
