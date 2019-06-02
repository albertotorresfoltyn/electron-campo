import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const Example = ({ campo }) => {
  const { IdCampo, Nombre, Descripcion, Superficie } = campo

  return (
    <Card
      bg="primary"
      text="white"
      style={{
        width: '18rem'
      }}
    >
      <Card.Img variant = "top" src = "holder.js/100px180?random=yes" />
      <Card.Body>
        <Card.Title>{Nombre}</Card.Title>
        <Card.Text>{Descripcion}</Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  )
}

export default Example
