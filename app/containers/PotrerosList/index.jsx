// @flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./Potrero.css";
import {
  Button,
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
import DataService from "../../services/DataService";
import PotreroCard from "./PotreroCard";
import Estado from "../../components/Estado";
import Leyenda from "../../components/Leyenda";
import { withRouter } from "react-router-dom";
import { debug } from "util";

class PotrerosList extends Component {
  constructor(props) {
    super(props);
    this.calcularTotalDetalle = this.calcularTotalDetalle.bind(this);

    this.state = {
      potreros: [],
      potrerosResumen: []
    };
  }

  componentWillMount() {
    this.setState({
      potreros: DataService.getPotreros(this.props.match.params.campoId),
      potrerosResumen: this.calcularTotalDetalle(
        DataService.getDetallePotreros()
      )
    });
  }

  // Calcula el detalle resumen total
  calcularTotalDetalle(list) {
    list.reduce((acc, i) => {
      var isPresent = acc.find(e => {
        return e.type === i.type;
      });
      if (!isPresent) {
        acc.push(i); //primer valor en la sumarizacion
      } else {
        isPresent.total += i.total; // sumo
        //reemplazo en el arreglo
        var index = acc.findIndex(e => {
          return e.type === i.type;
        });
        if (index !== -1) {
          acc[index] = isPresent;
        }
      }
      return acc;
    }, []);
  
    return list;
  }

  render() {
    const { history } = this.props;
    return (
      <div className="containerCustom"  >
        <Breadcrumb className="text-white bg-darklight breadcumclass">
          <BreadcrumbItem  className="text-white bg-darklight" active> <span className="vertAli ">LA EUGENIA</span></BreadcrumbItem>
          <BreadcrumbItem  className="text-white bg-darklight" active> <Button
                  className=""
                  color="success"
                  onClick={() => {
                    history.push("/CambioCategoria/");
                  }}
                >
                  Cambio de categoria
                </Button>{" "}</BreadcrumbItem>
        </Breadcrumb>

        <div className={styles.container} data-tid="container" className="mt-4">
          <Container fluid className="text-center">
         
            <Row>
              <Col md="8">
              
                  <div className="card-body pt-0">
                    <Row>
                      {this.state.potreros.map(potrero => (
                        <Col md="3" key={potrero.IdPotrero}>
                          <PotreroCard
                            key={potrero.IdPotrero}
                            potrero={potrero}
                            onClick={() => {
                              this.props.history.push(
                                "/potrero/" + potrero.IdPotrero
                              );
                            }}
                          />
                        </Col>
                      ))}
                    </Row>

                </div>


              </Col>

              <Col md="4">


                <div className="card shadow mb-4 allWidth">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">MAPA</h6>
                  </div>
                  <div className="card-body">
                    <img
                      className="mx-auto img-fluid"
                      width="400"
                      height="180"
                      src="../app/assets/img/mapa.png"
                    ></img>
                  </div>
                </div>





                <div className="card shadow mb-4 allWidth" >
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">ESTADO</h6>
                </div>
                <div className="card-body">
                <Estado
                    key={this.props.match.params.campoId}
                    potreroDetalle={this.state.potrerosResumen}
                    type="potreros"
                  />       </div>
              </div>


              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(PotrerosList);
