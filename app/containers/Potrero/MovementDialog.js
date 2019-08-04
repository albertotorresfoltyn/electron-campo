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
  CardBody
} from "reactstrap";
import ModernDatepicker from "react-modern-datepicker";
import MovementDiff from "./MovementDiff";
import DataService from "../../services/DataService";

export default class MovementDialog extends Component {
  constructor(props) {
    super(props);

    this.dropdownToggleCampo = this.dropdownToggleCampo.bind(this);
    this.changeValueCampo = this.changeValueCampo.bind(this);

    this.dropdownTogglePotrero = this.dropdownTogglePotrero.bind(this);
    this.changeValuePotrero = this.changeValuePotrero.bind(this);

    this.state = {
      openDropCampo: false,
      openDropPotrero: false,
      campos: [],
      potreros: []
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

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        className={this.props.className}
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

          <Card>
            <CardHeader>ORIGEN </CardHeader>
            <CardBody>
              <CardText>
                <Row>
                  <Table>
                    <thead>
                      <tr>
                        <th>Hacienda</th>
                        <th>Cant. Original</th>
                        <th>Cant. Movimiento</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>Larry</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </Table>
                </Row>
              </CardText>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>DESTINO </CardHeader>
            <CardBody>
              <CardText>
                <Row>
                  <Col></Col>
                  <Col></Col>
                </Row>
              </CardText>
            </CardBody>
          </Card>

          <Row>
            <Col>
              <MovementDiff
                type="add"
                initialValues={[
                  { type: "vaca", qtty: 10 },
                  { type: "toro", qtty: 20 },
                  { type: "ternero", qtty: 30 },
                  { type: "ternera", qtty: 40 }
                ]}
                differentialValues={[5, 10, 15, 20]}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <MovementDiff
                type="del"
                initialValues={[
                  { type: "vaca", qtty: 15 },
                  { type: "toro", qtty: 20 },
                  { type: "ternero", qtty: 30 },
                  { type: "ternera", qtty: 40 }
                ]}
                differentialValues={[5, 10, 15, 20]}
              />
            </Col>
          </Row>
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
