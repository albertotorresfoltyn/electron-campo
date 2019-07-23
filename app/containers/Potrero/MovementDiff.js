import React, { Component } from 'react'

export default class MovementDiff extends Component {

  doFancyOp(q1, q2, op) {
    return op ==='add'?q1+q2:q1-q2; //TODO: Verify if I can remove the q2 number to q2 to avoid negative values
  }
  render() {
    return (
      <div>
      Tipo ganado   -   Cantidad Original   -   Cantidad movimiento -   Total Final
      {
        this.props.initialValues.map( (element, index) => {
          const diff = this.props.differentialValues[index];
          return <div>
            <div>{element.type}</div><div>{element.qtty}</div><div>{this.props.type === 'add' ? '+' : '-'}{diff}</div><div>{this.doFancyOp(element.qtty, diff, this.props.type)}</div>
          </div>
        })
      }
      </div>
    )
  }
}
