// @flow
import React, { Component, Fragment } from "react";
import DataService from "../../services/DataService";
import BootstrapTable from "react-bootstrap-table-next";
import { withRouter } from "react-router-dom";
import paginationFactory from "react-bootstrap-table2-paginator";

import Index from "../../utils/Index";

class Historial extends Component {
  constructor(props) {
    super(props);
    // this.calcularTotalDetalle = this.calcularTotalDetalle.bind(this);
    this.state = {
      historialList: this.props.historial,
      potreros: [],
    };
  }

  componentWillMount() {
    // ALBERT
    //const result = DataService.getAllDetalleByPotrero(this.props.IdPotrero);
    const resultPotreros = DataService.getAllPotreros();
    this.setState({/* historialList: result, */potreros: resultPotreros });
  }

  componentWillReceiveProps(nextProps){
    this.setState({historialList: this.props.historial})
  }


  calcularTotalDetalle() {}

  render() {
    const formatoDetalle = cell => {
      const res = cell.map(item => {
        return (
          <div>
            <strong style={{ color: "gray" }}>
              {" "}
              {`${item.amount} ${item.type}`}{" "}
            </strong>
          </div>
        );
      });
      return <Fragment>{res}</Fragment>;
    };

    const formatoMov = (cell, row) => {
      const res = cell.map(item => {
        const isBajaOrEgreso =
          row.TipoMovimiento == "BAJA" || row.TipoMovimiento == "EGRESO";
        return (
          <div>
            <strong
              style={isBajaOrEgreso ? { color: "red" } : { color: "green" }}
            >
              {" "}
              {`${isBajaOrEgreso ? "-" : "+"} ${item.amount} ${item.type}`}{" "}
            </strong>
          </div>
        );
      });
      return <Fragment>{res}</Fragment>;
    };

    const formatoPotrero = cell => {
    if(cell){
      const res = this.state.potreros.filter(x => x.IdPotrero == cell)[0].Nombre;
      return <Fragment>{res}</Fragment>;
    }
   
    };

    const formatoTipoMov = cell => {
      return (
        <Fragment>
          <strong>{cell}</strong>
        </Fragment>
      );
    };

    const columns = [
      {
        dataField: "IdMovimiento",
        text: "IdMovimiento",
        sort: true
      },
      {
        dataField: "Fecha",
        text: "Fecha",
        sort: true
      },
      {
        dataField: "TipoMovimiento",
        text: "Tipo Movimiento",
        sort: true,
        formatter: formatoTipoMov
      },
      {
        dataField: "Motivo",
        text: "Motivo",
        sort: true
      },
      {
        dataField: "Observaciones",
        text: "Observaciones",
        sort: false
      },
      {
        dataField: "PotreroOrigen",
        text: "Potrero Origen",
        formatter: formatoPotrero
      },
      ,
      {
        dataField: "PotreroDestino",
        text: "Potrero Destino",
        formatter: formatoPotrero
      },
      {
        dataField: "MovimientoDetalle",
        text: "Movimientos",
        sort: false,
        formatter: formatoMov
      },
      {
        dataField: "PotreroDetalle",
        text: "Detalle",
        sort: false,
        formatter: formatoDetalle
      }
    ];

    const defaultSorted = [
      {
        dataField: "Fecha",
        order: "desc"
      }
    ];

    return (
      <BootstrapTable
        bootstrap4
        keyField="IdMovimiento"
        data={this.state.historialList}
        columns={columns}
        defaultSorted={defaultSorted}
        pagination={paginationFactory()}
      />
    );
  }
}

export default withRouter(Historial);
