
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
import MovementDiff from './MovementDiff';

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
          <Row>
            <Col>
              <MovementDiff
                type='add'
                initialValues={[{type: 'vaca', qtty: 10}, {type: 'toro', qtty: 20}, {type: 'ternero', qtty: 30}, {type:'ternera', qtty: 40} ]}
                differentialValues={[5, 10, 15, 20]}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <MovementDiff
                type='del'
                initialValues={[{ type: 'vaca', qtty: 15 }, { type: 'toro', qtty: 20 }, { type: 'ternero', qtty: 30 }, { type: 'ternera', qtty: 40 }]}
                differentialValues={[5, 10, 15, 20]}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.toggle}>
            Do Something
                </Button>{' '}
          <Button color="secondary" onClick={this.props.toggle}>
            Cancel
                </Button>
        </ModalFooter>
      </Modal>
    )
  }
}
