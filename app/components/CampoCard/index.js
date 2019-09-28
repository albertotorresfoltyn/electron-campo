/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React from 'react'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const Example = ({campo, ...props }) => {
  const { IdCampo, Nombre, Descripcion, Superficie, Total } = campo

  return (

    <div {...props} className="mb-4">
              <div className="card border-left-primary shadow h-100 py-2 ">
                <div className="card-body p-0">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="display-4 font-weight-bold text-primary text-uppercase mb-1">{Nombre}</div>
                      <div className=" mb-0"><span className=" h5 font-weight-bold text-gray-800" >{Total}</span>  <span >potreros</span> </div>
                      <div className=" mb-0  "> <span className=" font-weight-bold text-gray-800"> {Superficie}</span> ha</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default Example
