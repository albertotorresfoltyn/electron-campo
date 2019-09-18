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
  CardText
} from "reactstrap";

class CambioCategoria extends Component {
  constructor(props) {
    super(props);

    this.changeDrop = this.changeDrop.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.changesValues = this.changesValues.bind(this);


    

    this.state = {
      openCatOrigen: false,
      openCatDestino: false,
      categoriasOrigen: [],
      categoriasDestino: [],
      listadoExistencia: [],
      categoriaOrSeleccionada: {},
      categoriaDesSeleccionada: {}
    };
  }

  componentWillMount() {
    const result = DataService.getCategoriaHacienda();
    console.log(result);
    this.setState({
      categoriasOrigen: result,
      categoriasDestino: result,
      categoriaOrSeleccionada: result[0],
      categoriaDesSeleccionada: result[0]
    });
  }

  dropdownToggle(propertyState) {
    const newState = {};
    newState[propertyState] = !this.state[propertyState];
    this.setState(newState); //drinkMate
  }

  // se dispara cuando cambia un drop
  changeDrop(e, state, item, fnc) {
    debugger;
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
              <Col className="text-canter">
                <label>De Categoria</label>
                <Dropdown
                  isOpen={this.state.openCatOrigen}
                  toggle={() => {
                    this.dropdownToggle("openCatOrigen");
                  }}
                >
                  <DropdownToggle caret>
                    {this.state.categoriaOrSeleccionada.Nombre}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.categoriasOrigen.map(item => (
                      <DropdownItem
                        id={item.Nombre}
                        key={item.Nombre}
                        onClick={ev => {
                          this.changeDrop(ev, "categoriaOrSeleccionada", item);
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
                    {this.state.categoriaDesSeleccionada.Nombre}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.categoriasDestino.map(item => (
                      <DropdownItem
                        id={item.Nombre}
                        key={item.Nombre}
                        onClick={ev => {
                          this.changeDrop(ev, "categoriaDesSeleccionada", item);
                        }}
                      >
                        {item.Nombre}
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
            
            <Row>
              <Col></Col>
              <Col></Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(CambioCategoria);
