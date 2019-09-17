// @flow
import React, { Component } from 'react';
import DataService from '../../services/DataService';
import BootstrapTable from 'react-bootstrap-table-next';
import { withRouter } from 'react-router-dom';
import paginationFactory from 'react-bootstrap-table2-paginator';


class CambioCategoria extends Component {
  constructor(props) {
    super(props);


    // this.calcularTotalDetalle = this.calcularTotalDetalle.bind(this);

    this.state = {
     categoriasOrigen: [],
     categoriasDestino: [],
     listadoExistencia: [],
    };
  }

  componentWillMount() {
   
    const result  = DataService.getAllDetalleByPotrero(2038);
    this.setState({ historialList: result });
    
  }


  render() {

   
   



    return (

      <button>LPM </button>
    );
  }
}

export default withRouter(CambioCategoria);
