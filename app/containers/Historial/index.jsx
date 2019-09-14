// @flow
import React, { Component } from 'react';
import DataService from '../../services/DataService';
import BootstrapTable from 'react-bootstrap-table-next';
import { withRouter } from 'react-router-dom';


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
    this.setState({ historialList: DataService.getAllDetalleByPotrero(2038) });
  }


  calcularTotalDetalle() {
  }

  render() {
    const columns = [{
      dataField: 'id',
      text: 'Product ID',
      sort: true,
    }, {
      dataField: 'name',
      text: 'Product Name',
      sort: true,
    }, {
      dataField: 'price',
      text: 'Product Price',
      sort: true,
    }];

    const defaultSorted = [{
      dataField: 'name',
      order: 'desc',
    }];

    const products = [
      { id: 4, name: 'Item name', productPrice: 2104 },
      { id: 5, name: 'Item name', productPrice: 2104 },
      { id: 3, name: 'Item name', productPrice: 2103 },
    ];

    return (<BootstrapTable
      bootstrap4
      keyField="id"
      data={products}
      columns={columns}
      defaultSorted={defaultSorted}
    />);
  }
}

export default withRouter(Historial);
