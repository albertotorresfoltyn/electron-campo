// @flow
import React, { Component } from 'react';

import DataService from '../../services/DataService';

import {
  withRouter
} from 'react-router-dom';


class Historial extends Component {
  constructor(props) {
    super(props);


    //this.calcularTotalDetalle = this.calcularTotalDetalle.bind(this);
    
    this.state = {
      historialList: [],
    };

  }

  componentWillMount() {
   //ALBERT
    this.setState({ historialList: DataService.getAllDetalleByPotrero(2038)});
 
  }

  
  calcularTotalDetalle () {
  }

  render() {
    return (
      <div>
        
      este es el historial

       
      </div>
    );
  }
}

export default withRouter(Historial)
