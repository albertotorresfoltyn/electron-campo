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
    this.altaNacimiento = this.altaNacimiento.bind(this);
    this.GuardarMovimientoBD = this.GuardarMovimientoBD.bind(this);
    this.validateSelectedPotreros = this.validateSelectedPotreros.bind(this);

    this.state = {
      openDropCampo: false,
      openDropPotrero: false,
      openDropMotivo: false,
      openDropCategoria: false,
      potreros: [],
      estadoPotreroOrigen: this.props.potreroOrigen, // recibirlo como prop, lo seteo desde prop aca
      estadoPotreroDestino: this.props.potreroDestino, // recibirlo como prop, lo seteo desde prop aca
      observaciones: "",
      potreroSelected: null,
      tipoMovimiento: "",
      motivos: [],
      motivoSelected: {},
      categoriaHaciendaSeleccionada: null,
      cantidadAlta: 0
    };
  }

  componentDidMount() {
    const motivos = DataService.getMotivos(); // recupera todos los motivos de muerte
    this.cargarPotreros(); // cargar todos los potreros de un campo
    this.setState({ motivos: motivos, motivoSelected: motivos[0] }); // Seleccionar motivo de muerte por defecto
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tipoMovimiento: nextProps.tipoMovimiento,
      estadoPotreroOrigen: nextProps.potreroOrigen,
      estadoPotreroDestino: nextProps.potreroDestino,
      observaciones: "",
     
    });
    this.cargarPotreros(nextProps.tipoMovimiento);
  }

  // Cargar informacion de los dos potreros que intervienen en la operacion
  loadProtreros(item) {
    switch (this.state.tipoMovimiento) {
      case "INGRESO":
        let potreroOrigen = null;
          // Cargo potrero Origen
          potreroOrigen = DataService.getLastDetalleByPotrero(item.IdPotrero);
        
        this.setState({
          estadoPotreroOrigen: potreroOrigen
        });
        break;
      case "EGRESO":
          let potreroDestino = null;
        // Cargo potrero destino
        if (item.IdPotrero != "OTRO") {
         potreroDestino = DataService.getLastDetalleByPotrero(item.IdPotrero);
        }
      
        this.setState({
          estadoPotreroDestino: potreroDestino
        });
        break;
    }
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
    if (
      this.state.estadoPotreroOrigen != null &&
      this.getCantTotalMov(this.state.estadoPotreroOrigen) == 0
    ) {
      return "No existen movimientos";
    }
    return "";
  }

  // valida si tiene movimientos la operacion
  validateSelectedPotreros() {
    if (this.state.potreroSelected.Nombre != "OTRO" && (!this.state.estadoPotreroOrigen || !this.state.estadoPotreroDestino))
      return "Selecciona potrero";

    return "";
  }

  // valida si tiene cantidad de hacienda para dar de alta
  validatehasAlta() {
    if (
      parseInt(this.state.cantidadAlta) == 0 ||
      isNaN(this.state.cantidadAlta)
    ) {
      return "Debes ingresar la cantidad de hacienda para dar de alta. ";
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
        errormsj = this.validateSelectedPotreros();
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

  altaNacimiento(movimientos, detalle) {
    let indexMov = movimientos.findIndex(
      x => x.type == this.state.categoriaHaciendaSeleccionada.Nombre
    );
    let indexDet = detalle.findIndex(
      x => x.type == this.state.categoriaHaciendaSeleccionada.Nombre
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
  }

  GuardarMovimientoBD(tipoMov, estado, origen, destino, motivo, idPotrero) {

    let movimientos = estado.map(e =>
      DataConvert.toDefaultEntity(e.type, e.cantMov)
    );
    let detalle = estado.map(e => DataConvert.toDefaultEntity(e.type, e.total));
    if (tipoMov == "NACIMIENTO") {
      this.altaNacimiento(movimientos, detalle);
    }

    let mov = DataConvert.toMovimientoEntity(
      idPotrero,
      this.state.observaciones,
      motivo,
      movimientos,
      detalle,
      origen,
      destino,
      tipoMov
    );
    // guardar los movimientos en BD
    DataService.guardarMovimiento(mov);
  }
  // Guarda Moviemiento en Base de datos
  guardarMovimiento() {
    if (!this.validacionOperaciones()) return false; //validaciones

    let idOrigen = null;
    let idDestino = null;
    let motivo = null;
    let estado = this.state.estadoPotreroOrigen;
    let segundoEstado = this.state.estadoPotreroDestino;


    const dobleMovimiento =
      this.state.tipoMovimiento == "INGRESO" ||
      (this.state.tipoMovimiento == "EGRESO" && this.state.potreroSelected.Nombre != "OTRO"); // en los casos de ingreso o egreso hay que hacer un doble movimiento.

    switch (this.props.tipoMovimiento) {
      case "INGRESO":
        idOrigen = this.state.potreroSelected.IdPotrero;
        idDestino = this.props.IdPotrero;
        estado = this.state.estadoPotreroDestino;
        segundoEstado = this.state.estadoPotreroOrigen;
        break;
      case "EGRESO":
        idOrigen = this.props.IdPotrero;
        idDestino = this.state.potreroSelected.IdPotrero;
        break;
      case "BAJA":
        motivo = this.state.motivoSelected.amount;
        break;
      case "NACIMIENTO":
        break;
    }

    // Guarda el movimiento principal
    this.GuardarMovimientoBD(
      this.state.tipoMovimiento,
      estado,
      idOrigen,
      idDestino,
      motivo,
      this.props.IdPotrero
    );

    if (dobleMovimiento) {
      // el segundo movimiento siempre es el opuesto del primero
      this.GuardarMovimientoBD(
        this.state.tipoMovimiento == "INGRESO" ? "EGRESO" : "INGRESO",
        segundoEstado,
        idOrigen,
        idDestino,
        motivo,
        this.state.potreroSelected.IdPotrero
      );
    }
    alert("Guardados correctamente");
    // cerrar el modal
    this.props.toggle();
  }

  // Busca potreros de BD y guarda en estado para cargar el dropdown
  cargarPotreros(mov) {
  
    
    const potreros = DataService.getAllPotreros();
    // sacar de este listado el potrero destino.
    potreros.splice(
      potreros.findIndex(i => i.IdPotrero === this.props.IdPotrero),
      1
    );
    if(mov && mov == "EGRESO"){
      potreros.push({ IdPotrero: "OTRO", Nombre: "OTRO" });
    }
   
    // Guarda en el estado
    this.setState({ potreros: potreros }); // por defecto seteo el primero
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
    let estadoPotreroEditable = this.state.estadoPotreroOrigen;
    let estadoPotreroReadOnly = this.state.estadoPotreroDestino;
    const recordEditable = estadoPotreroEditable.find(v => v.type === type);

    if (
      this.state.tipoMovimiento == "INGRESO" ||
      this.state.tipoMovimiento == "EGRESO"
    ) {
      const errormsj = this.validateSelectedPotreros();
      if (errormsj != "") {
        alert(errormsj);
        return;
      }
    }

    if (recordEditable) {
      if (value > recordEditable.qtty) {
        return;
      }
      if (value.trim() == "") {
        value = 0;
      }
      value = parseInt(value);
      // Modificando el origen
      recordEditable.total = recordEditable.qtty - value;
      recordEditable.cantMov = value;
      const indexPotrero = estadoPotreroEditable.findIndex(
        v => v.type === type
      );
      estadoPotreroEditable[indexPotrero] = recordEditable;

      if (estadoPotreroReadOnly != null) {
        // modificar el potrero en donde repercute los movimientos
        const recordRO = estadoPotreroReadOnly.find(v => v.type === type);
        if (recordRO) {
          // el tipo de hacienda existe en el destino
          const res = recordRO.qtty + parseInt(value);
          recordRO.total = isNaN(res) ? recordRO.qtty : res;
          recordRO.cantMov = isNaN(parseInt(value)) ? 0 : value;
          const indexPotreroD = estadoPotreroReadOnly.findIndex(
            v => v.type === type
          );

          estadoPotreroReadOnly[indexPotreroD] = recordRO;
        } else {
          // el tipo de hacienda no existe en el destino y tengo que agregarla
          const regNuevo = {
            type,
            qtty: 0,
            cantMov: parseInt(value),
            total: parseInt(value)
          };

          estadoPotreroReadOnly.push(regNuevo);
        }
      }
      this.setState({
        estadoPotreroOrigen: estadoPotreroEditable,
        estadoPotreroDestino: estadoPotreroReadOnly
      });
    }
  }

  // INGRESO / EGRESO
  dibujarIngreso() {
    return (
      <Fragment>
        <Card>
          <CardHeader>
            {this.state.tipoMovimiento == "INGRESO" ? "ORIGEN" : "DESTINO"}
          </CardHeader>
          <CardBody>
            <Row>
              <Col>
                <label>Potreros:</label>
                <Dropdown
                  isOpen={this.state.openDropPotrero}
                  toggle={() => {
                    this.dropdownToggle("openDropPotrero");
                  }}
                >
                  <DropdownToggle caret>
                    {this.state.potreroSelected
                      ? this.state.potreroSelected.Nombre
                      : "Seleccionar Potrero "}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.state.potreros.map(item => (
                      <DropdownItem
                        id={item.IdPotrero}
                        key={item.IdPotrero}
                        onClick={ev => {
                          this.changeDrop(ev, "potreroSelected", item, () => {
                            this.loadProtreros(item);
                          });
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

        <Row>
          <Col>
            <Alert className="mt-3" color="secondary">
              ORIGEN
            </Alert>
            <MovementDiff
              mode="edit"
              type="potrero"
              initialValues={this.state.estadoPotreroOrigen}
              changesValues={this.changesValues}
            />
          </Col>
          <Col>
            <Alert className="mt-3" color="secondary">
              DESTINO
            </Alert>
            <MovementDiff
              mode="readonly"
              type="potrero"
              initialValues={this.state.estadoPotreroDestino}
              changesValues={this.changesValues}
            />
          </Col>
        </Row>

        <Alert className="mt-3" color="secondary">
          OBSERVACIONES
        </Alert>
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
                          x.Nombre.toUpperCase() == "TERNERA" ||
                          x.Nombre.toUpperCase() == "TORITO"
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
                  required
                  min="0"
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
                  type="potrero"
                  mode="edit"
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
      case "NACIMIENTO":
        return this.dibujarNacimiento();
      case "BAJA":
        return this.dibujarBaja();
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
          Movimiento {this.props.tipoMovimiento}
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
