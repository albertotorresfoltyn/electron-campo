
import React, { Component } from 'react'
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
  Card,
  CardTitle,
  CardText
} from 'reactstrap';
import ModernDatepicker from 'react-modern-datepicker'


export default class MovementDialog extends Component {
  constructor(props) {
    super(props);
    this.state={};
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
          <Row>
            <Col>
              <label>
                Fecha del movimiento:{' '}
                <ModernDatepicker
                  date={new Date()}
                  format={'DD-MM-YYYY'}
                  showBorder
                  style={{ zIndex: 1000 }}
                  onChange={date => this.handleChange(date)}
                  placeholder={'Seleccione un dia'}
                />{' '}
              </label>
            </Col>
          </Row>
          <Row>
            <Col>
              <label>
                Cantidad (cabezas):{' '}
                <input
                  type="text"
                  pattern="[0-9]*"
                  onInput={this.handleChange.bind(this)}
                  value={this.state.financialGoal}
                />
              </label>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.toggle}>
            Do Something
                </Button>{' '}
          <Button color="secondary" onClick={this.toggle}>
            Cancel
                </Button>
        </ModalFooter>
      </Modal>
    )
  }
}
