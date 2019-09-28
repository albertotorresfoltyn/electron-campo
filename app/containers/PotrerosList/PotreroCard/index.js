/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { ListGroup, ListGroupItem } from 'reactstrap';
import CardImg from 'react-bootstrap/CardImg';

const Example = ( {potrero,...props }) => {
  console.log(potrero);
  const { Nombre, Descripcion, Superficie, Calidad, Codigo } = potrero

  return (

<div className="mb-4" {...props}>
              <div className="card border-left-primary shadow h-100 py-2 ">
                <div className="card-body p-0">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">{Nombre}</div>
                      <div className=" mb-0"><span className=" h5 font-weight-bold text-gray-800" >150</span>  <span >cabezas</span> </div>
                      <div className=" mb-0  "> <span className=" text-gray-800"> {Superficie}</span> ha</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


    // <Card {...props} className="mb-2">
    //   <Card.Header className="bg-primary text-white p-0 m-0"> <span className="text-uppercase"></span>
    //   </Card.Header>

    //   <Card.Body className="text p-1">
    //     <p> {Superficie}<strong> ha</strong></p>
    //     <p> 150<strong> cabezas</strong></p>
    //   </Card.Body>
    // </Card>
  )
}

export default Example
