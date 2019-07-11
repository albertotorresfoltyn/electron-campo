// @flow
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ModernDatepicker from 'react-modern-datepicker'
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
} from 'reactstrap'
import DataService from '../../services/DataService'
import Estado from '../../components/Estado'
import Leyenda from '../../components/Leyenda'

import { withRouter } from 'react-router-dom'

class Potrero extends Component {
  constructor (props) {
    super(props)
    this.state = {
      potrero: [],
      modalVisible: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount () {
    console.log(this.props);
    // this.props.match.params.campoId  Mandar tmb esto
    this.setState({
      potrero: DataService.getPotrero(this.props.match.params.potreroId)
    });
  }

  handleChange(evt) {
    const financialGoal = evt.target.validity.valid
      ? evt.target.value
      : this.state.financialGoal;
    this.setState({ financialGoal });
  }

  toggle() {
    this.setState({ modalVisible: !this.state.modalVisible })
  }

  render () {
    const { potrero } = this.state
    return (
      <div>
        <div data-tid="container">
          <Breadcrumb className="blueColor">
            <BreadcrumbItem active>
              POTRERO {potrero.Nombre} - {potrero.Codigo}
            </BreadcrumbItem>{' '}
          </Breadcrumb>

          <Container>
            <Row className="mb-3">
              <Button
                className="mr-1"
                color="success"
                onClick={this.toggle}
              >
                Ingreso
              </Button>{' '}
              <Button className="mr-1" color="success" onClick={this.toggle}>
                Egreso
              </Button>{' '}
              <Button className="mr-1" color="success" onClick={this.toggle}>
                Baja
              </Button>{' '}
              <Button className="mr-1" color="success" onClick={this.toggle}>
                Nacimiento
              </Button>{' '}
            </Row>

            <Row className="">
              <Card body outline color="secondary" className="p-3 mb-2">
                <CardTitle>
                  <strong>Resumen</strong>
                </CardTitle>
                <CardText>Aca esta el resumen del potrero</CardText>
                <CardText>
                  <span> {potrero.IdPotrero}</span>
                  <span> {potrero.Descripcion}</span>
                </CardText>
              </Card>
            </Row>

            <Row>
              <Col>
                <Card body outline color="secondary" className="p-3 mb-2">
                  <CardTitle>
                    <strong>Estado Actual</strong>
                  </CardTitle>
                  <CardText>
                    <Row>
                      <Col>
                        {' '}
                        <Estado key={potrero.Nombre} />
                      </Col>
                      <Col>
                        {' '}
                        <Leyenda className="mx-auto" />
                      </Col>
                    </Row>
                  </CardText>
                </Card>
              </Col>
            </Row>
            <Modal
              isOpen={this.state.modalVisible}
              toggle={this.toggle}
              className={this.props.className}
            >
              <ModalHeader toggle={this.toggle}>Nuevo movimiento</ModalHeader>
              <ModalBody>
                <Row>
                  <Col>
                    <label>
                      Tipo de movimiento:{' '}
                      <select>
                        <option value="volvo">Volvo</option>
                        <option value="saab">Saab</option>
                        <option value="mercedes">Mercedes</option>
                        <option value="audi">Audi</option>
                      </select>
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
                    <label>
                      Fecha del movimiento:{' '}
                      <ModernDatepicker
                        date={this.state.startDate}
                        format={'DD-MM-YYYY'}
                        showBorder
                        onChange={date => this.handleChange(date)}
                        placeholder={'Seleccione un dia'}
                      />{' '}
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
          </Container>
        </div>
      </div>
    )
  }
}

export default withRouter(Potrero)
