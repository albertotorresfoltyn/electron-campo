// @flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardTitle,
 
  CardHeader,
  CardBody,
  Table
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
      potreroDetalle: DataService.getDetalleByPotrero(
        this.props.match.params.potreroId
      ),
      coloresHacienda: DataService.getCategoriaHacienda(),
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

            <Card>
              <CardHeader>RESUMEN - {potrero.Nombre}</CardHeader>
              <CardBody>
              
                  <ul className="list-group mb-3">
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                      <Container>
                        <Row>
                          <Col>
                            <small className="text-muted">Descripción</small>
                            <h6 className="my-0">{potrero.Descripcion}</h6>
                          </Col>
                        </Row>
                      </Container>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                      <Container>
                        <Row>
                          <Col>
                            <small className="text-muted">Calidad</small>
                            <h6 className="my-0">{potrero.Calidad}</h6>
                          </Col>
                          <Col>
                            <small className="text-muted">Superficie</small>
                            <h6 className="my-0">{potrero.Superficie} ha</h6>
                          </Col>
                        </Row>
                      </Container>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                      <Container>
                        <Row>
                          <Col>
                            <small className="text-muted">Cantidad Saleros</small>
                            <h6 className="my-0">{potrero.CantidadSaleros}</h6>
                          </Col>
                          <Col>
                            <small className="text-muted">Rendimiento</small>
                            <h6 className="my-0">{potrero.Rendimiento}</h6>
                          </Col>
                        </Row>
                      </Container>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                      <Container>
                        <Row>
                          <Col>
                            <small className="text-muted">Cantidad Aguadas</small>
                            <h6 className="my-0">{potrero.CantidadAguadas}</h6>
                          </Col>
                          <Col>
                            <small className="text-muted">Carga Soportada</small>
                            <h6 className="my-0">{potrero.CargaSoportada}</h6>
                          </Col>
                        </Row>
                      </Container>
                    </li>
                  </ul>
              
              </CardBody>
            </Card>

            <Card className="mt-3">
              <CardHeader>Estado Actual</CardHeader>
              <CardBody>
               
                  <Row>
                    <Col>
                      <Table size="md" bordered>
                        <thead>
                          <tr>
                            <th>Tipo Hacienda</th>
                            <th>Cantidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.potreroDetalle.map((items, i) => (
                            <tr  key={i}>
                              <th scope="row">
                                {
                                  <div>
                                    <Button
                                    
                                      style={{
                                        backgroundColor: this.state.coloresHacienda.find(
                                          e => 
                                            e.Nombre.toUpperCase() ==
                                            items.type.toUpperCase()
                                        ).Color
                                      }}
                                      size="lg"
                                    ></Button>{" "}
                                    {items.type}
                                  </div>
                                }
                              </th>
                              <th>{items.total}</th>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                    <Col>
                      <Card>
                        <CardHeader>
                          Gráfico del potrero {potrero.Nombre}
                        </CardHeader>
                        <CardBody>
                         
                            <Estado
                              key={potrero.Nombre}
                              potreroDetalle={this.state.potreroDetalle}
                            />
                         
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
             
              </CardBody>
            </Card>

            <MovementDialog
              isOpen={this.state.modalVisible}
              toggle={this.toggle}
              campos={this.state.campos}
              IdPotrero={this.state.potrero.IdPotrero}
              tipoMovimiento={this.state.tipoMovimiento}
              categoriasHacienda = {this.state.coloresHacienda}
            />
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(Potrero);
