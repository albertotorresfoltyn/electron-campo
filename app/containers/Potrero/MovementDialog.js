import React, { Component } from "react";
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
  CardTitle,
  CardText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  Table,
  CardHeader,
  CardFooter,
  CardBody,
  Alert,
  Input
} from "reactstrap";
import ModernDatepicker from "react-modern-datepicker";
import MovementDiff from "./MovementDiff";
import DataService from "../../services/DataService";

export default class MovementDialog extends Component {
  constructor(props) {
    super(props);

    this.changesValues = this.changesValues.bind(this);

    this.dropdownToggleCampo = this.dropdownToggleCampo.bind(this);
    this.changeValueCampo = this.changeValueCampo.bind(this);

    this.dropdownTogglePotrero = this.dropdownTogglePotrero.bind(this);
    this.changeValuePotrero = this.changeValuePotrero.bind(this);
    this.guardarMovimiento = this.guardarMovimiento.bind(this);
    this.toMovimientoEntity = this.toMovimientoEntity.bind(this);
    this.toDefaultEntity = this.toDefaultEntity.bind(this);

    this.state = {
      openDropCampo: false,
      openDropPotrero: false,
      campos: [],
      potreros: [],
      estadoPotreroOrigen: [], // recibirlo como prop, lo seteo desde prop aca
      estadoPotreroDestino: [], // recibirlo como prop, lo seteo desde prop aca
      observaciones: ""
    };
  }

  componentDidMount() {
    /*  Campos */
    const campos = DataService.getCampos();
    this.setState({ campos });
    this.state.campoSelected = campos[0].Nombre;

    this.cargarPotreros(campos[0].IdCampo);
    this.loadProtreros();

 
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tipoMovimiento: nextProps.tipoMovimiento });
  }

  loadProtreros() {

     DataService.getDetalleByPotrero( this.props.IdPotrero);
    const potreroOrigen = DataService.getDetalleByPotrero(
      this.state.potreroSelected
    );
    const potreroDestino = DataService.getDetalleByPotrero(
      this.props.IdPotrero
    );
    this.setState({
      estadoPotreroOrigen: potreroOrigen,
      estadoPotreroDestino: potreroDestino
    });
  }

  dropdownToggleCampo() {
    this.setState({
      openDropCampo: !this.state.openDropCampo
    });
  }

  dropdownTogglePotrero() {
    this.setState({
      openDropPotrero: !this.state.openDropPotrero
    });
  }

  toMovimientoEntity(idPotrero, obs, movDetalle, potDetalle) {
    const mov = {
      idPotrero: idPotrero,
      Fecha: new Date()
        .toJSON()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("/"),
      Observaciones: obs,
      movimientoDetalle: JSON.stringify(movDetalle),
      potreroDetalle: JSON.stringify(potDetalle)
    };
    return mov;
  }

  toDefaultEntity(type, amount) {
    const mov = {
      type: type,
      amount: amount
    };
    return mov;
  }

  getCantTotalMov(list) {
    return list.map(o => o.cantMov).reduce((a, c) => a + c);
  }

  // Guarda el moviemiento en BD
  guardarMovimiento() {
    // validaciones
    if (this.getCantTotalMov(this.state.estadoPotreroOrigen) > 0) {
        const mov = this.toMovimientoEntity(
        this.props.IdPotrero,
        this.state.observaciones,
        this.state.estadoPotreroOrigen.map(e =>
          this.toDefaultEntity(e.type, e.cantMov)
        ),
          this.state.estadoPotreroOrigen.map(e =>
          this.toDefaultEntity(e.type, e.total)
        )
      );
     
      // guardar los movimientos
      DataService.guardarMovimiento(mov);

      alert("Guardados correctamente")

      // cerrar el modal
      this.props.toggle();
    }
    else{
      alert(" No existen movimientos para guardar")
    }
  }

  cargarPotreros(idCampo) {
    const potreros = DataService.getPotreros(idCampo);
    const idPotreroDestino = this.props.IdPotrero;
    // sacar de este listado el potrero destino.
    potreros.splice(
      potreros.findIndex(i => i.IdPotrero === idPotreroDestino),
      1
    );
    this.setState({ potreros });
    this.state.potreroSelected = potreros[0].IdPotrero;
  }

  changeValueCampo(e) {
    this.setState({ campoSelected: e.currentTarget.textContent });
    this.cargarPotreros(e.currentTarget.id);
  }

  changeValuePotrero(e) {
    this.setState({ potreroSelected: e.currentTarget.textContent });
    this.loadProtreros();
  }

  handleChange(evt) {
    const financialGoal = evt.target.validity.valid
      ? evt.target.value
      : this.state.financialGoal;
    this.setState({ financialGoal });
  }

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
        <ModalBody>
          <Card>
            <CardHeader>
              Origen - ¿Desde donde queres traer la hacienda?
            </CardHeader>
            <CardBody>
              <CardText>
                <Row>
                  <Col>
                    <label>Campo:</label>
                    <Dropdown
                      isOpen={this.state.openDropCampo}
                      toggle={this.dropdownToggleCampo}
                    >
                      <DropdownToggle caret>
                        {this.state.campoSelected}
                      </DropdownToggle>
                      <DropdownMenu>
                        {this.state.campos.map(e => (
                          <DropdownItem
                            id={e.IdCampo}
                            key={e.IdCampo}
                            onClick={this.changeValueCampo}
                          >
                            {e.Nombre}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                  <Col>
                    <label>Potreros:</label>
                    <Dropdown
                      isOpen={this.state.openDropPotrero}
                      toggle={this.dropdownTogglePotrero}
                    >
                      <DropdownToggle caret>
                        {this.state.potreroSelected}
                      </DropdownToggle>
                      <DropdownMenu>
                        {this.state.potreros.map(e => (
                          <DropdownItem
                            id={e.IdPotrero}
                            key={e.IdPotrero}
                            onClick={this.changeValuePotrero}
                          >
                            {e.Nombre}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                </Row>
              </CardText>
            </CardBody>
          </Card>

          <Alert className="mt-3" color="secondary">
            ORIGEN
          </Alert>

          <MovementDiff
            type="edit"
            initialValues={this.state.estadoPotreroOrigen}
            changesValues={this.changesValues}
          />
          <Alert color="secondary">DESTINO </Alert>
          <span />

          <MovementDiff
            type="readonly"
            initialValues={this.state.estadoPotreroDestino}
            changesValues={this.changesValues}
          />

          <Input
            type="text"
            placeholder="Observaciones"
            value={this.state.observaciones}
            onChange ={e => {  this.setState({
              observaciones:  e.target.value
            })}}
          />
        </ModalBody>
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
