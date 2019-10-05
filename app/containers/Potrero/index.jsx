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
import Historial from "./../Historial";

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
      potreroDetalle: DataService.getLastDetalleByPotrero(
        this.props.match.params.potreroId
      ),
      potreroHistorial: DataService.getAllDetalleByPotrero(
        this.props.match.params.potreroId
      ),
      coloresHacienda: DataService.getCategoriaHacienda(),
      modalVisible: false,
      tipoMovimiento: "",
      potreroOrigen: {},
      potreroDestino: {}
    };
    this.saveHookHandler = this.saveHookHandler.bind(this);
    this.toggle = this.toggle.bind(this);
    this.abrirModalMovimiento = this.abrirModalMovimiento.bind(this);
    this.setPotreroDestino = this.setPotreroDestino.bind(this);
    this.setPotreroOrigen = this.setPotreroOrigen.bind(this);
  }

  toggle() {
    this.setState(
      {
        modalVisible: !this.state.modalVisible,
        potrero: DataService.getPotrero(this.props.match.params.potreroId),
        potreroDetalle: DataService.getLastDetalleByPotrero(
          this.props.match.params.potreroId
        ),
        potreroHistorial: DataService.getAllDetalleByPotrero(
          this.props.match.params.potreroId
        )
      },
      () => {
        this.forceUpdate();
      }
    );
  }

  saveHookHandler() {
    this.forceUpdate();
  }

  setPotreroOrigen(tipoMovimiento) {
    switch (tipoMovimiento) {
      case "INGRESO":
        return null;

      default:
        //NACIMIENTO BAJA EGRESO EL ORIGEN ES EL POTRERO ACTUAL
        return DataService.getLastDetalleByPotrero(
          this.state.potrero.IdPotrero
        );
    }
  }

  setPotreroDestino(tipoMovimiento) {
    switch (tipoMovimiento) {
      case "INGRESO":
        return DataService.getLastDetalleByPotrero(
          this.state.potrero.IdPotrero
        );
      default:
        //NACIMIENTO BAJA EGRESO EL DESTINO ES NULL
        return null;
    }
  }

  abrirModalMovimiento(tipoMovimiento) {
    this.setState({
      potreroOrigen: this.setPotreroOrigen(tipoMovimiento),
      potreroDestino: this.setPotreroDestino(tipoMovimiento),
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
      <div className="containerCustom">
        <Breadcrumb className="text-white bg-darklight breadcumclass">
        <BreadcrumbItem  className="text-white bg-darklight" active> <span className="vertAli text-uppercase">{potrero.Nombre} </span></BreadcrumbItem>
          

          <div className=" ml-5">
            <a
              className="btn btn-primary btn-icon-split mr-4"
              onClick={() => {
                this.abrirModalMovimiento(TiposMov.INGRESO);
              }}
            >
              <span className="icon text-white-50">
                <i className="fas fa-arrow-down"></i>
              </span>
              <span className="text">INGRESO</span>
            </a>
            <a
              className="btn btn-primary btn-icon-split mr-4"
              onClick={() => {
                this.abrirModalMovimiento(TiposMov.EGRESO);
              }}
            >
              <span className="icon text-white-50">
                <i className="fas fa-arrow-up"></i>
              </span>
              <span className="text">EGRESO</span>
            </a>
            <a
              className="btn btn-danger btn-icon-split mr-4"
              onClick={() => {
                this.abrirModalMovimiento(TiposMov.BAJA);
              }}
            >
              <span className="icon text-white-50">
                <i className="fas fa-trash"></i>
              </span>
              <span className="text">BAJA</span>
            </a>
            <a
              className="btn btn-success btn-icon-split mr-4"
              onClick={() => {
                this.abrirModalMovimiento(TiposMov.NACIMIENTO);
              }}
            >
              <span className="icon text-white-50">
                <i className="fas fa-check"></i>
              </span>
              <span className="text">NACIMIENTO</span>
            </a>
          </div>
        </Breadcrumb>

        <Container fluid className="mt-4">
        
         
          {/* <!-- Content Row --> */}
          <div className="row">
            {/* <!-- Earnings (Monthly) Card Example --> */}
            <div className="col-xl-2 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Descripción
                      </div>
                      <div className=" mb-0 font-weight-bold text-gray-800">
                        {potrero.Descripcion}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Earnings (Monthly) Card Example --> */}
            <div className="col-xl-2 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Calidad
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {potrero.Calidad}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Earnings (Monthly) Card Example --> */}
            <div className="col-xl-2 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Superficie
                      </div>
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto">
                          <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                            {potrero.Superficie} ha
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Pending Requests Card Example --> */}
            <div className="col-xl-2 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Cantidad Saleros
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {potrero.CantidadSaleros}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Pending Requests Card Example --> */}
            <div className="col-xl-2 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                        Cantidad Aguadas
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {potrero.CantidadAguadas}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Pending Requests Card Example --> */}
            <div className="col-xl-2 col-md-6 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info  text-uppercase mb-1">
                        Carga Soportada
                      </div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {potrero.CargaSoportada}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Content Row --> */}

          <div className="row">
            {/* <!-- Area Chart --> */}
            <div className="col-xl-8 col-lg-7">
              <div className="card shadow mb-4">
                {/* <!-- Card Header - Dropdown --> */}
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Movimientos
                  </h6>
                </div>
                {/* <!-- Card Body --> */}
                <div className="card-body">
                  <Historial
                    historial={this.state.potreroHistorial}
                    key={this.state.potrero.IdPotrero}
                    IdPotrero={this.state.potrero.IdPotrero}
                  ></Historial>
                </div>
              </div>
            </div>

            {/* <!-- Pie Chart --> */}
            <div className="col-xl-4 col-lg-5">
              <div className="card shadow mb-4">
                {/* <!-- Card Header - Dropdown --> */}
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <h6 className="m-0 font-weight-bold text-primary">
                    Estado Actual
                  </h6>
                </div>
                {/* <!-- Card Body --> */}
                <div className="card-body">
                  <Table size="md" bordered>
                    <thead>
                      <tr>
                        <th>Tipo Hacienda</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.potreroDetalle.map((items, i) => (
                        <tr key={i}>
                          <th scope="row">
                            {
                              <div>
                                <span className="mr-2">
                                  <i
                                    className="fas fa-circle"
                                    style={{
                                      color: this.state.coloresHacienda.find(
                                        e =>
                                          e.Nombre.toUpperCase() ==
                                          items.type.toUpperCase()
                                      ).Color
                                    }}
                                  ></i>{" "}
                                </span>

                                {items.type}
                              </div>
                            }
                          </th>
                          <th>{items.total}</th>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              <div className="">
                <div className="card shadow mb-4">
                  {/* <!-- Card Header - Dropdown --> */}
                  <div className="card-header">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Gráfico
                    </h6>
                  </div>
                  <CardBody>
                    <div>
                      <Estado
                        key={potrero.Nombre}
                        potreroDetalle={this.state.potreroDetalle}
                        type="potrero"
                      />
                    </div>
                  </CardBody>
                </div>
              </div>
            </div>
          </div>

          {/* ESTADO ACTUAL */}

          <MovementDialog
            isOpen={this.state.modalVisible}
            toggle={this.toggle}
            campos={this.state.campos}
            IdPotrero={this.state.potrero.IdPotrero}
            tipoMovimiento={this.state.tipoMovimiento}
            categoriasHacienda={this.state.coloresHacienda}
            potreroOrigen={this.state.potreroOrigen}
            potreroDestino={this.state.potreroDestino}
            onSaveHook={this.saveHookHandler}
          />
        </Container>
      </div>
    );
  }
}

export default withRouter(Potrero);
