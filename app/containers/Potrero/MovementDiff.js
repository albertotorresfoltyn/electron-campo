import React, { Component } from 'react';
import { Table } from 'reactstrap';

export default class MovementDiff extends Component {

  doFancyOp(q1, q2, op) {
    return op ==='add'?q1+q2:q1-q2; //TODO: Verify if I can remove the q2 number to q2 to avoid negative values
  }
  render() {
    return (
      <div>


<Table bordered>
        <thead>
          <tr>
            <th>Tipo Ganado</th>
            <th>Cant. Original</th>
            <th>Cant. Movimiento</th>
            <th>Total Final</th>
          </tr>
        </thead>
        <tbody>

        {
        this.props.initialValues.map( (element, index) => {
          const diff = this.props.differentialValues[index];
          return  <tr>
          <th scope="row">{element.type}</th>
          <td>{this.props.type === 'add' ? '+' : '-'}{diff}</td>
          
          <td>{this.doFancyOp(element.qtty, diff, this.props.type)}</td>
          <td></td>
        </tr>
          
          
         
        })
      }
        </tbody>
      </Table>
 
    
      </div>
    )
  }
}
