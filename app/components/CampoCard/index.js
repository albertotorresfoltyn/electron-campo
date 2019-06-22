/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const Example = ({campo, ...props }) => {
  const { IdCampo, Nombre, Descripcion, Superficie, Total } = campo

  return (
   
   <Card {...props}>
      <Card.Header  className="bg-info text-white"> <h4 className="text-uppercase">{Nombre}</h4></Card.Header>
      <Card.Body className="text">
        <p><strong>Superficie:</strong> {Superficie}</p>
        <p><strong>Cantidad de Potreros:</strong> {Total}</p>
        <p><strong>Descripción:</strong> {Descripcion}</p>
       
      </Card.Body>
    </Card>
  )
}

export default Example
