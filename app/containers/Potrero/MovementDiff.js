import React, { Component } from "react";
import { Table, FormGroup, Label, Input } from "reactstrap";

export default class MovementDiff extends Component {

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
                <tr key={index}>
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
