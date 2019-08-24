import React, { Component } from "react";
import { Table, FormGroup, Label, Input } from "reactstrap";

export default class MovementDiff extends Component {
  doFancyOp(q1, q2, op) {
    return op === "add" ? q1 + q2 : q1 - q2; //TODO: Verify if I can remove the q2 number to q2 to avoid negative values
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
            {this.props.initialValues.map((element, index) => {
            
              return (
                <tr>
                  <th scope="row">{element.type}</th>
                  <td>{element.qtty}</td>

                  <td className="">
                    {this.props.type === "edit" ? (
                      <Input
                        type="number"
                        placeholder="Cant. ganado a mover"
                        value = {element.cantMov}
                        onChange={e => {
                          this.props.changesValues(
                            element.type,
                            e.target.value
                          );
                        }}
                      />
                    ) : (
                      <span> {element.cantMov}</span>
                    )}
                  </td>
                  <td>{element.total}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
