import React, { Component, Fragment } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardHeader,
  CardBody,
  Alert,
  Input
} from "reactstrap";
import ModernDatepicker from "react-modern-datepicker";
import MovementDiff from "./MovementDiff";
import DataService from "../../services/DataService";
import DataConvert from "../../utils/DataConvert";
import { debug } from "util";

export default class MovementDialog extends Component {
  constructor(props) {
    super(props);

    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.changesValues = this.changesValues.bind(this);
    this.changeDrop = this.changeDrop.bind(this);
    this.guardarMovimiento = this.guardarMovimiento.bind(this);
    this.cargarPotreros = this.cargarPotreros.bind(this);
    this.getCantTotalMov = this.getCantTotalMov.bind(this);
    this.loadProtreros = this.loadProtreros.bind(this);
    this.validatehasMovement = this.validatehasMovement.bind(this);
    this.validatehasAlta = this.validatehasAlta.bind(this);
    this.validatehasCategoria = this.validatehasCategoria.bind(this);
    this.validacionOperaciones = this.validacionOperaciones.bind(this);

    this.state = {
      openDropCampo: false,
      openDropPotrero: false,
      openDropMotivo: false,
      openDropCategoria: false,
      campoSelected: "",
      campos: [],
      potreros: [],
      estadoPotreroOrigen: [], // recibirlo como prop, lo seteo desde prop aca
      estadoPotreroDestino: [], // recibirlo como prop, lo seteo desde prop aca
      observaciones: "",
      potreroSelected: {},
      tipoMovimiento: "",
      motivos: [],
      motivoSelected: {},
      categoriaHaciendaSeleccionada: null,
      cantidadAlta: 0
    };
  }

  componentDidMount() {
    const campos = DataService.getCampos(); // recupera todos los campos
    const motivos = DataService.getMotivos(); // recupera todos los motivos de muerte

    this.setState({ campos, motivos });
    this.setState({ campoSelected: campos[0] }); // setea el primer campo como el seleccionado
    this.cargarPotreros(campos[0].IdCampo); // cargar todos los potreros de un campo
    this.setState({ motivoSelected: motivos[0] }); // Seleccionar motivo de muerte por defecto
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tipoMovimiento: nextProps.tipoMovimiento });
  }

  // Cargar informacion de los dos potreros que intervienen en la operacion
  loadProtreros() {
    // Cargo potrero Origen
    const potreroOrigen = DataService.getLastDetalleByPotrero(
      this.state.potreroSelected.IdPotrero
    );

    // Cargo potrero destino
    const potreroDestino = DataService.getLastDetalleByPotrero(
      this.props.IdPotrero
    );

    // guardo en el estado
    this.setState({
      estadoPotreroOrigen: potreroOrigen,
      estadoPotreroDestino: potreroDestino
    });
  }

  dropdownToggle(propertyState) {
    const newState = {};
    newState[propertyState] = !this.state[propertyState];
    this.setState(newState); //drinkMate
  }

  // devuelve cantidad de moviemientos que hizo el usuario en esa lista
  // Suma de campo cantMov del listado que se pasa como parametro
  getCantTotalMov(list) {
    return list.map(o => o.cantMov).reduce((a, c) => a + c);
  }

  // valida si tiene movimientos la operacion
  validatehasMovement() {
    if (this.getCantTotalMov(this.state.estadoPotreroOrigen) == 0) {
      return "No existen movimientos";
    }
    return "";
  }

  // valida si tiene cantidad de hacienda para dar de alta
  validatehasAlta() {
    if (parseInt(this.state.cantidadAlta) == 0) {
      return " Debes ingresar la cantidad de hacienda para dar de alta. ";
    }
    return "";
  }

  validatehasCategoria() {
    if (this.state.categoriaHaciendaSeleccionada == null) {
      return " Debe seleccionar una categoría. ";
    }
    return "";
  }

  // se encarga de las validaciones de todos los moviemientos
  validacionOperaciones() {
    let errormsj = "";
    switch (this.props.tipoMovimiento) {
      case "INGRESO":
      case "EGRESO":
        errormsj = this.validatehasMovement();
        break;

      case "NACIMIENTO":
        errormsj += this.validatehasAlta();
        errormsj += this.validatehasCategoria();
        break;

      case "BAJA":
        errormsj = this.validatehasMovement();
        break;
    }

    if (errormsj != "") {
      alert(errormsj);
      return false;
    }
    return true;
  }

  // Guarda Moviemiento en Base de datos
  guardarMovimiento() {
    if (!this.validacionOperaciones()) return false; //validaciones

    let mov = {};
    let movimientos = [];
    let detalle = [];

    // falta tener en cuenta que los movimientos de ingreso o egreso, generan dos moviemientos por detras 

    switch (this.props.tipoMovimiento) {
      case "INGRESO":
      case "EGRESO":
      case "BAJA":
        movimientos = this.state.estadoPotreroOrigen.map(e =>
          DataConvert.toDefaultEntity(e.type, e.cantMov)
        );
        detalle = this.state.estadoPotreroOrigen.map(e =>
          DataConvert.toDefaultEntity(e.type, e.total)
        );
        break;

      case "NACIMIENTO":
        // Movimiento de alta
        movimientos = this.state.estadoPotreroOrigen.map(e =>
          DataConvert.toDefaultEntity(e.type, e.cantMov)
        );

        // movimiento de detalle --> como quedo el potrero
        detalle = this.state.estadoPotreroOrigen.map(e =>
          DataConvert.toDefaultEntity(e.type, e.total)
        );

        let indexMov = movimientos.findIndex(
          x =>
            x.type.toUpperCase() ==
            this.state.categoriaHaciendaSeleccionada.Nombre.toUpperCase()
        );
        let indexDet = detalle.findIndex(
          x =>
            x.type.toUpperCase() ==
            this.state.categoriaHaciendaSeleccionada.Nombre.toUpperCase()
        );

        if (indexMov == -1) {
          // no se encontro el elemento
          movimientos.push({
            type: this.state.categoriaHaciendaSeleccionada.Nombre,
            amount: this.state.cantidadAlta
          });
        } else {
          movimientos[indexMov].amount = this.state.cantidadAlta;
        }

        if (indexDet == -1) {
          // no se encontro el elemento
          detalle.push({
            type: this.state.categoriaHaciendaSeleccionada.Nombre,
            amount: this.state.cantidadAlta
          });
        } else {
          // actualizo la cantidad que ya habia, con la cantidad nueva
          detalle[indexDet].amount =
            detalle[indexDet].amount + this.state.cantidadAlta;
        }

        break;
    }

    // Creo objeto para dar de alta en BD 
    mov = DataConvert.toMovimientoEntity(
      this.props.IdPotrero,
      this.state.observaciones,
      this.props.tipoMovimiento == "BAJA"
        ? this.state.motivoSelected.amount
        : "",
      movimientos,
      detalle,
      this.potreroOrigen.IdPotrero,
      this.potreroDestino.IdPotrero,
      this.props.tipoMovimiento
    );

    // guardar los movimientos en BD
    DataService.guardarMovimiento(mov);

    alert("Guardados correctamente");

    // cerrar el modal
    this.props.toggle();
  }

  // Busca potreros de BD y guarda en estado
  cargarPotreros(idCampo) {
    const potreros = DataService.getPotreros(idCampo);
    const idPotreroDestino = this.props.IdPotrero;

    // sacar de este listado el potrero destino.
    potreros.splice(
      potreros.findIndex(i => i.IdPotrero === idPotreroDestino),
      1
    );

    // Guarda en el estado
    this.setState(
      { potreros: potreros, potreroSelected: potreros[0] },
      this.loadProtreros
    ); // por defecto seteo el primero
  }

  // se dispara cuando cambia un drop
  changeDrop(e, state, item, fnc) {
   
    const newState = {};
    newState[state] = item;
    this.setState(newState); //drinkMate
    fnc && fnc();
  }

  handleChange(evt) {
    const financialGoal = evt.target.validity.valid
      ? evt.target.value
      : this.state.financialGoal;
    this.setState({ financialGoal });
  }

  // se cambia algun valor en los input para mover hacienda
  changesValues(type, value) {
    const recordO = this.state.estadoPotreroOrigen.find(v => v.type === type);
    if (recordO) {
      if (value > recordO.qtty) {
        return;
      }
      // Modificando el origen
      recordO.total = recordO.qtty - value;
      recordO.cantMov = value;
      const arrayPotrero = this.state.estadoPotreroOrigen;
      const indexPotrero = this.state.estadoPotreroOrigen.findIndex(
        v => v.type === type
      );
      arrayPotrero[indexPotrero] = recordO;

      // modificar el destino
      const recordD = this.state.estadoPotreroDestino.find(
        v => v.type === type
      );
      if (recordD) {
        // el tipo de hacienda existe en el destino
        const res = recordD.qtty + parseInt(value);
        recordD.total = isNaN(res) ? recordD.qtty : res;
        recordD.cantMov = isNaN(parseInt(value)) ? 0 : value;
        const arrayPotreroD = this.state.estadoPotreroDestino;
        const indexPotreroD = this.state.estadoPotreroDestino.findIndex(
          v => v.type === type
        );
        arrayPotreroD[indexPotreroD] = recordD;
        this.setState({
          estadoPotreroOrigen: arrayPotrero,
          estadoPotreroDestino: arrayPotreroD
        });
      } else {
        // el tipo de hacienda no existe en el destino y tengo que agregarla
        const regNuevo = {
          type,
          qtty: 0,
          cantMov: parseInt(value),
          total: parseInt(value)
        };
        const arrayPotreroD = this.state.estadoPotreroDestino;
        arrayPotreroD.push(regNuevo);
        this.setState({
          estadoPotreroOrigen: arrayPotrero,
          estadoPotreroDestino: arrayPotreroD
        });
      }
    }
  }

  // INGRESO / EGRESO
  dibujarIngreso() {
    return (
      <Fragment>
        <Card>
          <CardHeader>
            Origen - ¿Desde donde queres traer la hacienda?
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <label>Campo:</label>
                <Dropdown
                  isOpen={this.state.openDropCampo}
                  toggle={() => {
                    this.dropdownToggle("openDropCampo");
                  }}
                >
                  <DropdownToggle caret>
                    {this.state.campoSelected.Nombre}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.campos.map(item => (
                      <DropdownItem
                        id={item.IdCampo}
                        key={item.IdCampo}
                        onClick={ev => {
                          this.changeDrop(ev, "campoSelected", item, () => {
                            this.cargarPotreros(item.IdCampo);
                          });
                        }}
                      >
                        {item.Nombre}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </Col>
              <Col>
                <label>Potreros:</label>
                <Dropdown
                  isOpen={this.state.openDropPotrero}
                  toggle={() => {
                    this.dropdownToggle("openDropPotrero");
                  }}
                >
                  <DropdownToggle caret>
                    {this.state.potreroSelected.Nombre}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.potreros.map(item => (
                      <DropdownItem
                        id={item.IdPotrero}
                        key={item.IdPotrero}
                        onClick={ev => {
                          this.changeDrop(
                            ev,
                            "potreroSelected",
                            item,
                            this.loadProtreros
                          );
                        }}
                      >
                        {item.Nombre}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Alert className="mt-3" color="secondary">
          ORIGEN
        </Alert>

        <MovementDiff
          mode="edit"
          type="potrero"
          initialValues={this.state.estadoPotreroOrigen}
          changesValues={this.changesValues}


        />
        <Alert color="secondary">DESTINO </Alert>
        <span />

        <MovementDiff
          mode="readonly"
          type="potrero"
          initialValues={this.state.estadoPotreroDestino}
          changesValues={this.changesValues}
        />

        <Input
          type="text"
          placeholder="Observaciones"
          value={this.state.observaciones}
          onChange={e => {
            this.setState({
              observaciones: e.target.value
            });
          }}
        />
      </Fragment>
    );
  }

  //NACIEMIENTO
  dibujarNacimiento() {
    return (
      <Fragment>
        <Card>
          <CardHeader>Nombre del potrero</CardHeader>
          <CardBody>
            <Row>
              <Col>
                <label>Categoria</label>
                <Dropdown
                  isOpen={this.state.openDropCategoria}
                  toggle={() => {
                    this.dropdownToggle("openDropCategoria");
                  }}
                >
                  <DropdownToggle caret>
                    {this.state.categoriaHaciendaSeleccionada
                      ? this.state.categoriaHaciendaSeleccionada.Nombre
                      : "Seleccionar categoría Hacienda"}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.props.categoriasHacienda
                      .filter(
                        x =>
                          x.Nombre.toUpperCase() == "TERNERO" ||
                          x.Nombre.toUpperCase() == "TERNERA"
                      )
                      .map(item => (
                        <DropdownItem
                          id={item.Nombre}
                          key={item.Nombre}
                          onClick={ev => {
                            this.changeDrop(
                              ev,
                              "categoriaHaciendaSeleccionada",
                              item
                            );
                          }}
                        >
                          {item.Nombre}
                        </DropdownItem>
                      ))}
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>
            <Row>
              <Col>
                <label>Cantidad</label>
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={this.state.cantidadAlta}
                  onChange={e => {
                    this.setState({
                      cantidadAlta: parseInt(e.target.value)
                    });
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <label>Descripción</label>
                <Input
                  type="text"
                  placeholder="Descripción"
                  value={this.state.observaciones}
                  onChange={e => {
                    this.setState({
                      observaciones: e.target.value
                    });
                  }}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Fragment>
    );
  }

  //BAJA
  dibujarBaja() {
    return (
      <Fragment>
        <Card>
          <CardHeader>Nombre del protrero</CardHeader>
          <CardBody>
            <Row>
              <Col>
                <MovementDiff
                  type="edit"
                  initialValues={this.state.estadoPotreroOrigen}
                  changesValues={this.changesValues}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <label>Motivo</label>
                <Dropdown
                  isOpen={this.state.openDropMotivo}
                  toggle={() => {
                    this.dropdownToggle("openDropMotivo");
                  }}
                >
                  <DropdownToggle caret>
                    {this.state.motivoSelected.amount}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.motivos.map(item => (
                      <DropdownItem
                        id={item.type}
                        key={item.amount}
                        onClick={ev => {
                          this.changeDrop(ev, "motivoSelected", item);
                        }}
                      >
                        {item.amount}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </Col>
            </Row>

            <Row>
              <Col>
                <label>Observaciones:</label>
                <Input
                  type="text"
                  placeholder="Ingresar Obervaciones"
                  value={this.state.observaciones}
                  onChange={e => {
                    this.setState({
                      observaciones: e.target.value
                    });
                  }}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Fragment>
    );
  }

  // Encargado de dibujar contenido del modal de movimientos
  drawShit() {
    switch (this.props.tipoMovimiento) {
      case "INGRESO":
      case "EGRESO":
        return this.dibujarIngreso();
        break;

      case "NACIMIENTO":
        return this.dibujarNacimiento();
        break;

      case "BAJA":
        return this.dibujarBaja();
        break;
    }
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        className={this.props.className}
        size="lg"
      >
        <ModalHeader toggle={this.toggle}>
          Nuevo movimiento del tipo {this.props.tipoMovimiento}{" "}
        </ModalHeader>
        <ModalBody>{this.drawShit()}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.guardarMovimiento}>
            Guardar Movimiento
          </Button>{" "}
          <Button color="secondary" onClick={this.props.toggle}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
