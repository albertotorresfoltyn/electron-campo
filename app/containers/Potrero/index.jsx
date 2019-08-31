// @flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardTitle,
  CardText
  
} from "reactstrap";
import DataService from "../../services/DataService";
import Estado from "../../components/Estado";
import Leyenda from "../../components/Leyenda";
import MovimentDialog from "./MovementDialog";
import "./calendar.css";
import { withRouter } from "react-router-dom";
import MovementDialog from "./MovementDialog";

const TiposMov = Object.freeze({
  INGRESO: "INGRESO",
  EGRESO: "EGRESO",
  NACIMIENTO: "NACIMIENTO",
  BAJA: "BAJA"
});

class Potrero extends Component {
  constructor(props) {
    super(props);

    this.state = {
      potrero: DataService.getPotrero(this.props.match.params.potreroId),
      modalVisible: false,
      tipoMovimiento: ""
    };

    this.toggle = this.toggle.bind(this);
    this.abrirModalMovimiento = this.abrirModalMovimiento.bind(this);
  }

  toggle() {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  abrirModalMovimiento(tipoMovimiento) {
    this.setState({
      tipoMovimiento: tipoMovimiento,
      modalVisible: !this.state.modalVisible
    });
  }

  render() {
    const { potrero } = this.state;
    const {
      Nombre,
      Descripcion,
      Superficie,
      Calidad,
      Codigo,
      Categoria,
      Rendimiento,
      CantidadSaleros,
      CantidadAguadas,
      CargaSoportada
    } = potrero;
    return (
      <div>
        <div data-tid="container">
          <Breadcrumb className="blueColor">
            <BreadcrumbItem active>
              POTRERO {potrero.Nombre} - {potrero.Codigo}
            </BreadcrumbItem>{" "}
          </Breadcrumb>

          <Container>
            <Row className="mb-3">
              <Button
                className="mr-1"
                color="success"
                onClick={() => {
                  this.abrirModalMovimiento(TiposMov.INGRESO);
                }}
              >
                Ingreso
              </Button>{" "}
              <Button
                className="mr-1"
                color="success"
                onClick={() => {
                  this.abrirModalMovimiento(TiposMov.EGRESO);
                }}
              >
                Egreso
              </Button>{" "}
              <Button
                className="mr-1"
                color="success"
                onClick={() => {
                  this.abrirModalMovimiento(TiposMov.BAJA);
                }}
              >
                Baja
              </Button>{" "}
              <Button
                className="mr-1"
                color="success"
                onClick={() => {
                  this.abrirModalMovimiento(TiposMov.NACIMIENTO);
                }}
              >
                Nacimiento
              </Button>{" "}
            </Row>

            <Row className="">
              <Card body outline color="secondary" className="p-3 mb-2">
                <CardTitle>
                  <strong>Resumen</strong>
                </CardTitle>
                <CardText>Aca esta el resumen del potrero</CardText>
                <CardText>
                  <span> {potrero.IdPotrero}</span>
                  <span> {potrero.Descripcion}</span>
                  <p>
                    <strong>Rendimiento:</strong> {Rendimiento}
                  </p>
                  <p>
                    <strong>Cantidad Saleros:</strong> {CantidadSaleros}
                  </p>
                  <p>
                    <strong>Cantidad Aguadas:</strong> {CantidadAguadas}
                  </p>
                  <p>
                    <strong>Carga Soportada:</strong> {CargaSoportada}
                  </p>
                </CardText>
              </Card>
            </Row>

            <Row>
              <Col>
                <Card body outline color="secondary" className="p-3 mb-2">
                  <CardTitle>
                    <strong>Estado Actual</strong>
                  </CardTitle>
                  <CardText>
                    <Row>
                      <Col>
                        {" "}
                        <Estado key={potrero.Nombre} />
                      </Col>
                      <Col>
                        {" "}
                        <Leyenda className="mx-auto" />
                      </Col>
                    </Row>
                  </CardText>
                </Card>
              </Col>
            </Row>
            <MovementDialog
              isOpen={this.state.modalVisible}
              toggle={this.toggle}
              campos={this.state.campos}
              IdPotrero={this.state.potrero.IdPotrero}
              tipoMovimiento ={this.state.tipoMovimiento}
            />
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(Potrero);
