// @flow
import React, { Component } from 'react';
import DataService from '../../services/DataService';
import BootstrapTable from 'react-bootstrap-table-next';
import { withRouter } from 'react-router-dom';
import paginationFactory from 'react-bootstrap-table2-paginator';


class Historial extends Component {
  constructor(props) {
    super(props);


    // this.calcularTotalDetalle = this.calcularTotalDetalle.bind(this);

    this.state = {
      historialList: [],
    };
  }

  componentWillMount() {
    // ALBERT
    const result  = DataService.getAllDetalleByPotrero(2038);
    this.setState({ historialList: result });
    console.log(result)
  }


  calcularTotalDetalle() {
  }

  render() {

    function priceFormatter(cell, row, rowIndex) {
      console.log("cell -------------------------------");

          console.log(cell);
         
            cell.map((item) => {
              return (
              <span>
              <strong style={ { color: 'red' } }>$ { item.type } </strong>
              <strong style={ { color: 'red' } }>$ { item.amount } </strong>
            </span>
              )
            }
          
          );
      
      
    }
     

    const columns = [
      {
        dataField: 'IdMovimiento',
        text: 'IdMovimiento',
        sort: true,
      },{
      dataField: 'Fecha',
      text: 'Fecha',
      sort: true,
    }, {
      dataField: 'TipoMovimiento',
      text: 'Tipo Movimiento',
      sort: true,
    }, {
      dataField: 'Motivo',
      text: 'Motivo',
      sort: true,
    }, {
      dataField: 'Observaciones',
      text: 'Observaciones',
      sort: false,
    }, {
      dataField: 'PotreroOrigen',
      text: 'Potrero Origen',
      sort: true,
    },
    , {
      dataField: 'PotreroDestino',
      text: 'Potrero Destino',
      sort: true,
    }
    ,{
      dataField: 'MovimientoDetalle',
      text: 'Movimientos',
      sort: false,
      formatter:priceFormatter   
    },{
      dataField: 'PotreroDetalle1',
      text: 'Detalle',
      sort: false,
    }];

    const defaultSorted = [{
      dataField: 'Fecha',
      order: 'desc',
    }];



    return (<BootstrapTable
   
      bootstrap4
      keyField="IdMovimiento"
      data={this.state.historialList}
      columns={columns}
      defaultSorted={defaultSorted}
      pagination={ paginationFactory() }
    />);
  }
}

export default withRouter(Historial);
