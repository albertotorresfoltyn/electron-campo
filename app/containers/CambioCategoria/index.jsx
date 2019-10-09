// @flow
import React, { Component } from 'react';
import DataService from '../../services/DataService';
import { withRouter } from 'react-router-dom';
import MovementDiff from '../../containers/Potrero/MovementDiff';
import {
  DropdownMenu,
  DropdownItem,
  Dropdown,
  DropdownToggle,
  Row,
  Col,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody,
  CardHeader,
  CardText,
  Button,
} from 'reactstrap';

class CambioCategoria extends Component {
  constructor(props) {
    super(props);

    this.changeDrop = this.changeDrop.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.changesValues = this.changesValues.bind(this);
    this.recategorize = this.recategorize.bind(this);
    this.filterListCategoriesOrigen = this.filterListCategoriesOrigen.bind(this);
    this.filterListCategoriesDestino = this.filterListCategoriesDestino.bind(this);
    this.managerSeleccionarOrigen = this.managerSeleccionarOrigen.bind(this);

    this.state = {
      openCatOrigen: false,
      openCatDestino: false,
      categoriasOrigen: [],
      categoriasDestino: [],
      listadoExistencia: [],
      detalles: [],
      relaciones: [],
      categoriaOrSeleccionada: {},
      categoriaDesSeleccionada: {},
    };
  }

  componentWillMount() {
    const resultCat = this.filterListCategoriesOrigen(DataService.getCategoriaHacienda()); // Listado de categorias Origen que acepten cambios
    const resultRel = DataService.getCategoriaHaciendaRelaciones(); // Relaciones entre categorias Origen y Destino
    const detalles = DataService.getDetallePotreros(); // Todos los detalles de los potreros

    this.setState({
      categoriasOrigen: resultCat,
      relaciones: resultRel,
      categoriaOrSeleccionada: 'Seleccionar',
      categoriaDesSeleccionada: 'Seleccionar',
      detalles,
    });
  }

  dropdownToggle(propertyState) {
    const newState = {};
    newState[propertyState] = !this.state[propertyState];
    this.setState(newState); // drinkMate
  }

  // Filtar categorias de hacienda que estan habilitadas para el cambio
  filterListCategoriesOrigen(list) {
    return list.filter(item => item.HabilitarCambio == 1);
  }

  // Maneja la logica despues de seleccionar categoria origen
  managerSeleccionarOrigen(categoriaOrigen) {
    this.filterListCategoriesDestino(categoriaOrigen); // cargar categorias destino
    // Filtrar por los potreros que contengan la categoria de hacienda que necesito.
    const resultList = [];
    this.state.detalles.map((potrero) => {
      const p = DataService.getPotrero(potrero.IdPotrero);
      potrero.PotreroDetalle.map((det) => {
        if (det.type.toUpperCase() === categoriaOrigen.toUpperCase()) {
          const elem = {
            id: potrero.IdPotrero,
            type: p.Nombre,
            qtty: det.amount,
            cantMov: 0,
            total: det.amount,
          };
          resultList.push(elem);
        }
      });
    });

    this.setState({
      listadoExistencia: resultList,

    });
  }
  // Filtrar categorias hacienda que esten relacionadas con la categoria Origen seleccionada
  filterListCategoriesDestino(categoriaOrigen) {
    const result = this.state.relaciones.filter(item => item.NombreOrigen === categoriaOrigen);
    this.setState({
      categoriasDestino: result,
      categoriaDesSeleccionada: 'Seleccionar',
    });
  }

  // se dispara cuando cambia un drop
  changeDrop(e, state, item, fnc) {
    const newState = {};
    newState[state] = item;
    this.setState(newState); // drinkMate
    fnc && fnc();
  }

  changesValues(type, value, element) {
    const e = element;
    const listado = this.state.listadoExistencia;
    e.cantMov = Number(value);
    listado[listado.indexOf(element)] = e;
    this.setState({ listadoExistencia: listado });
  }

  recategorize(e) {
    ((this.state.categoriaOrSeleccionada !== 'Seleccionar') && (this.state.categoriaDesSeleccionada !== 'Seleccionar'))?
    DataService.saveMovements(
      this.state.listadoExistencia,
      this.state.categoriaOrSeleccionada,
      this.state.categoriaDesSeleccionada,
    ):alert('selecciona las dos categorias, palurdo')
    
  }

  render() {
    return (
      <div className="containerCustom" >

<Breadcrumb className="text-white bg-darklight breadcumclass">
          <BreadcrumbItem  className="text-white bg-darklight" active> <span className="vertAli">LA EUGENIA</span></BreadcrumbItem>
        
        </Breadcrumb>
        <div className="container-fluid   pl-5 pr-5 mt-4" >
        <div className="card shadow mb-4  mt-1">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">CAMBIO DE CATEGORIA</h6>
                  </div>
                  <div className="card-body">
              
              
                <Row className="text-canter">
                  <Col className="text-canter" md="2">
                    <label>De Categoria</label>
                    <Dropdown
                      isOpen={this.state.openCatOrigen}
                      toggle={() => {
                        this.dropdownToggle('openCatOrigen');
                      }}
                    >
                      <DropdownToggle caret>
                        {this.state.categoriaOrSeleccionada}
                      </DropdownToggle>
                      <DropdownMenu>
                        {this.state.categoriasOrigen.map(item => (
                          <DropdownItem
                            id={item.Nombre}
                            key={item.Nombre}
                            onClick={(ev) => {
                              this.changeDrop(
                                ev,
                                'categoriaOrSeleccionada',
                                item.Nombre,
                                () => {
                                  this.managerSeleccionarOrigen(item.Nombre);
                                },
                              );
                            }}
                          >
                            {item.Nombre}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                   
                  </Col>

                  <Col className="text-canter" md="2">
                  <label>A Categoria:</label>
                    <Dropdown
                      isOpen={this.state.openCatDestino}
                      toggle={() => {
                        this.dropdownToggle('openCatDestino');
                      }}
                    >
                      <DropdownToggle caret>
                        {this.state.categoriaDesSeleccionada}
                      </DropdownToggle>
                      <DropdownMenu>
                        {this.state.categoriasDestino.map(item => (
                          <DropdownItem
                            id={item.NombreDestino}
                            key={item.NombreDestino}
                            onClick={(ev) => {
                              this.changeDrop(
                                ev,
                                'categoriaDesSeleccionada',
                                item.NombreDestino,
                              );
                            }}
                          >
                            {item.NombreDestino}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
              
                  <Col>
                    <MovementDiff
                      mode="edit"
                      type="potrero"
                      initialValues={this.state.listadoExistencia}
                      changesValues={this.changesValues}
                    />
                  </Col>
                </Row>
                <Row className="text-center mt-3">
              <Col>
                {' '}
                <Button color="primary" onClick={this.recategorize}>
                Guardar Cambios
          </Button>{" "}
             
              </Col>
            </Row>
                  </div>
                </div>
        
        </div>
      </div>
    );
  }
}

export default withRouter(CambioCategoria);
