// @flow
import React, { Component } from "react";
import DataService from "../../services/DataService";
import { withRouter } from "react-router-dom";
import MovementDiff from "../../containers/Potrero/MovementDiff";
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
  Button
} from "reactstrap";

class CambioCategoria extends Component {
  constructor(props) {
    super(props);

    this.changeDrop = this.changeDrop.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.changesValues = this.changesValues.bind(this);
    this.filterListCategoriesOrigen = this.filterListCategoriesOrigen.bind(this);
    this.filterListCategoriesDestino = this.filterListCategoriesDestino.bind(this);
    
    

    this.state = {
      openCatOrigen: false,
      openCatDestino: false,
      categoriasOrigen: [],
      categoriasDestino: [],
      listadoExistencia: [],
      relaciones: [],
      categoriaOrSeleccionada: {},
      categoriaDesSeleccionada: {}
    };
  }

  componentWillMount() {
    const resultCat = this.filterListCategoriesOrigen(DataService.getCategoriaHacienda());
    const resultRel = DataService.getCategoriaHaciendaRelaciones();

    
    this.setState({
      categoriasOrigen: resultCat,
      relaciones: resultRel,
      categoriaOrSeleccionada: "Seleccionar",
      categoriaDesSeleccionada:  "Seleccionar"
    });
  }

  dropdownToggle(propertyState) {
    const newState = {};
    newState[propertyState] = !this.state[propertyState];
    this.setState(newState); //drinkMate
  }

  // Filtar categorias de hacienda que estan habilitadas para el cambio
  filterListCategoriesOrigen(list) {
    
   return list.filter(item=> item.HabilitarCambio == 1);
    
  }
// Filtrar categorias hacienda que esten relacionadas con la categoria Origen seleccionada
  filterListCategoriesDestino(categoria) {

    const result = this.state.relaciones.filter(item=> item.NombreOrigen == categoria);
   debugger;
    this.setState({categoriasDestino:result, categoriaDesSeleccionada:"Seleccionar"}); 
  }

  // se dispara cuando cambia un drop
  changeDrop(e, state, item, fnc) {
    
    const newState = {};
    newState[state] = item;
    this.setState(newState); //drinkMate
    console.log(newState);
    fnc && fnc();
  }

  changesValues(type, value) {
   
    
  }

  render() {
    return (
      <div>
        <div data-tid="container">
          <Breadcrumb className="blueColor">
            <BreadcrumbItem active>Cambio de Categoría</BreadcrumbItem>{" "}
          </Breadcrumb>

          <Container>
            <Card>
              <CardBody>
                {/* Cambio de categoria */}
            <Row className="text-canter">
              <Col className="text-canter" md="2">
                <label>De Categoria</label>
                <Dropdown
                  isOpen={this.state.openCatOrigen}
                  toggle={() => {
                    this.dropdownToggle("openCatOrigen");
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
                        onClick={ev => {
                          this.changeDrop(ev, "categoriaOrSeleccionada", item.Nombre,  () => {
                            this.filterListCategoriesDestino( item.Nombre) ;
                            });
                          }}
                      >
                        {item.Nombre}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
           
            
                <label>A Categoria:</label>
                <Dropdown
                  isOpen={this.state.openCatDestino}
                  toggle={() => {
                    this.dropdownToggle("openCatDestino");
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
                        onClick={ev => {
                          this.changeDrop(ev, "categoriaDesSeleccionada", item.NombreDestino);
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
                  type="edit"
                  initialValues={this.state.listadoExistencia}
                  changesValues={this.changesValues}
                />

              
              </Col>
            </Row>

              </CardBody>
            </Card>
            
            <Row className="text-center mt-3">
              <Col> <Button> Guardar Cambios</Button></Col>
           
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(CambioCategoria);
