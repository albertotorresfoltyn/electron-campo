/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-filename-extension */
import React, { Component, Fragment } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { ListGroup, ListGroupItem } from "reactstrap";
import CardImg from "react-bootstrap/CardImg";

const Example = ({ potrero, ...props }) => {

  const {
    Nombre,
    Descripcion,
    Superficie,
    Calidad,
    Codigo,
    PotreroDetalle
  } = potrero;

  return (
    <div className="mb-4" {...props}>
      <div className="card border-left-primary shadow h-100 py-2 ">
        <div className="card-body p-0">
          <div className="row no-gutters align-items-center">
            <div className="col mr-2">
              <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                {Nombre}
              </div>
              <div className=" mb-0">
                <span className=" h5 font-weight-bold text-gray-800">
                {
                  PotreroDetalle.map( x=> x.amount).reduce((acc, item) => {
                    return parseInt(acc) + parseInt(item)
                  })
                }
                </span>{" "}
                <span>cabezas</span>{" "}
              </div>
              <div className=" mb-0  ">
                {" "}
                <span className=" text-gray-800"> {Superficie}</span> ha
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Example;
