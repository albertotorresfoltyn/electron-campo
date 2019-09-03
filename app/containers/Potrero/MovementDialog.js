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
import DataConvert from "../../utils/DataConvert";
import { debug } from "util";

export default class MovementDialog extends Component {
  constructor(props) {
    super(props);

    this.changesValues = this.changesValues.bind(this);
    this.dropdownToggleCampo = this.dropdownToggleCampo.bind(this);
    this.changeValueCampo = this.changeValueCampo.bind(this);
    this.dropdownTogglePotrero = this.dropdownTogglePotrero.bind(this);
    this.changeValuePotrero = this.changeValuePotrero.bind(this);
    this.guardarMovimiento = this.guardarMovimiento.bind(this);
    this.cargarPotreros = this.cargarPotreros.bind(this);
    this.getCantTotalMov = this.getCantTotalMov.bind(this);
    this.loadProtreros = this.loadProtreros.bind(this);
    
    
    this.state = {
      campoSelected: "",
      openDropCampo: false,
      openDropPotrero: false,
      campos: [],
      potreros: [],
      estadoPotreroOrigen: [], // recibirlo como prop, lo seteo desde prop aca
      estadoPotreroDestino: [], // recibirlo como prop, lo seteo desde prop aca
      observaciones: "",
      potreroSelected: {},
      tipoMovimiento : "" 
    };
  }

  componentDidMount() {
    debugger;
    // recupera todos los campos
    const campos = DataService.getCampos();
    
    // setea el campo seleccionado como el primero de la lista (Tenemos solo uno )
    this.setState({ campos});
    this.setState({  campoSelected: campos[0].Nombre});
    this.cargarPotreros(campos[0].IdCampo );
    

 
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ tipoMovimiento: nextProps.tipoMovimiento });
  }

  // Cargar informacion de los dos potreros que intervienen en la operacion
  loadProtreros() {
    // Cargo potrero Origen 
     const potreroOrigen = DataService.getDetalleByPotrero(
      this.state.potreroSelected.IdPotrero
    );

    // Cargo potrero destino  
    const potreroDestino = DataService.getDetalleByPotrero(
      this.props.IdPotrero
    );

    // guardo en el estado 
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

  // devuelve cantidad de moviemientos que hizo el usuario en esa lista
  // Suma de campo cantMov del listado que se pasa como parametro
  getCantTotalMov(list) {
    return list.map(o => o.cantMov).reduce((a, c) => a + c);
  }

  // Guarda Moviemiento en Base de datos  
  guardarMovimiento() {
    
    // validaciones
    if (this.getCantTotalMov(this.state.estadoPotreroOrigen) > 0) {
        const mov = DataConvert.toMovimientoEntity(
        this.props.IdPotrero,
        this.state.observaciones,
        this.state.estadoPotreroOrigen.map(e =>
          DataConvert.toDefaultEntity(e.type, e.cantMov)
        ),
          this.state.estadoPotreroOrigen.map(e =>
            DataConvert.toDefaultEntity(e.type, e.total)
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

  

  // Busca potreros de BD y guarda en estado
  cargarPotreros(idCampo) {
    const potreros = DataService.getPotreros(idCampo);
    const idPotreroDestino = this.props.IdPotrero;
   
    // sacar de este listado el potrero destino.
    potreros.splice(
      potreros.findIndex(i => i.IdPotrero === idPotreroDestino), 1 );
   
      // Guarda en el estado
    this.setState({potreros: potreros,  potreroSelected: potreros[0]}, this.loadProtreros); // por defecto seteo el primero
    
   
  }

  // se dispara cuando cambia el drop de campo
  changeValueCampo(e) {
    this.setState({ campoSelected: e.currentTarget.textContent });
    this.cargarPotreros(e.currentTarget.id);
  }

  // se dispara cuando cambia el drop de potreros
  changeValuePotrero(e) {
    this.setState({ potreroSelected: this.state.potreros.find( x=> x.IdPotrero == e.currentTarget.id)  });
    this.loadProtreros();
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
                        {this.state.potreroSelected.Nombre}
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
