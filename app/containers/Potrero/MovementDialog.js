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
  Alert
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

    this.state = {
      openDropCampo: false,
      openDropPotrero: false,
      campos: [],
      potreros: [],
      estadoPotreroOrigen: [
        { type: "vaca", qtty: 100, cantMov:0, total: 100 },
        { type: "toro", qtty: 200,cantMov:0, total: 200 },
        { type: "ternero", qtty: 300, cantMov:0,total: 300 },
        { type: "ternera", qtty: 50,cantMov:0, total: 50 }
      ], // recibirlo como prop, lo seteo desde prop aca
      estadoPotreroDestino: [
        { type: "vaca", qtty: 100,cantMov:0, total: 100 },
        { type: "toro", qtty: 200,cantMov:0, total: 200 },
        { type: "ternero", qtty: 300,cantMov:0, total: 300 },
        { type: "ternera", qtty: 50,cantMov:0, total: 50 }
      ] // recibirlo como prop, lo seteo desde prop aca
    };
  }

  componentDidMount() {
    /*  Campos */
    const campos = DataService.getCampos();
    this.setState({ campos: campos });
    this.state.campoSelected = campos[0].Nombre;

    this.cargarPotreros(campos[0].IdCampo);
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

  cargarPotreros(idCampo) {
    const potreros = DataService.getPotreros(idCampo);
    this.setState({ potreros: potreros });
    this.state.potreroSelected = potreros[0].Nombre;
  }

  changeValueCampo(e) {
    this.setState({ campoSelected: e.currentTarget.textContent });
    this.cargarPotreros(e.currentTarget.id);
  }
  changeValuePotrero(e) {
    this.setState({ potreroSelected: e.currentTarget.textContent });
  }

  handleChange(evt) {
    const financialGoal = evt.target.validity.valid
      ? evt.target.value
      : this.state.financialGoal;
    this.setState({ financialGoal });
  }

  changesValues(type, value) {
    debugger;
    const recordO = this.state.estadoPotreroOrigen.find(v => v.type === type);
    if (recordO) {
      if(value > recordO.qtty){
        return;
      }
      // Modificando el origen 
      recordO.total = recordO.qtty - value;
      const arrayPotrero = this.state.estadoPotreroOrigen;
      const indexPotrero = this.state.estadoPotreroOrigen.findIndex(v => v.type === type);
      arrayPotrero[indexPotrero] = recordO;

      // modificar el destino 
      const recordD = this.state.estadoPotreroDestino.find(v => v.type === type);
      if(recordD){
        // el tipo de hacienda existe en el destino 
        const res= recordD.qtty + parseInt(value);
        recordD.total = isNaN(res)?recordD.qtty: res;
        recordD.cantMov = isNaN(parseInt(value))? 0: value;
        const arrayPotreroD = this.state.estadoPotreroDestino;
        const indexPotreroD = this.state.estadoPotreroDestino.findIndex(v => v.type === type);
        arrayPotreroD[indexPotreroD] = recordD;
         this.setState({ estadoPotreroOrigen : arrayPotrero, estadoPotreroDestino : arrayPotreroD});

      }
      else{
        // el tipo de hacienda no existe en el destino y tengo que agregarla 


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
        <ModalHeader toggle={this.toggle}>Nuevo movimiento</ModalHeader>
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
                        {this.state.campos.map(e => {
                          return (
                            <DropdownItem
                              id={e.IdCampo}
                              key={e.IdCampo}
                              onClick={this.changeValueCampo}
                            >
                              {e.Nombre}
                            </DropdownItem>
                          );
                        })}
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
                        {this.state.potreros.map(e => {
                          return (
                            <DropdownItem
                              id={e.IdPotrero}
                              key={e.IdPotrero}
                              onClick={this.changeValuePotrero}
                            >
                              {e.Nombre}
                            </DropdownItem>
                          );
                        })}
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
          <span></span>

          <MovementDiff
            type="readonly"
            initialValues={this.state.estadoPotreroDestino}
            changesValues={this.changesValues}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.toggle}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={this.props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
