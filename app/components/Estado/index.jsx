import React, { Component } from "react";
import styles from "./Estado.css";

import DataConvert from "../../utils/DataConvert";
import DataService from "../../services/DataService";
import Plot from "react-plotly.js";
import { Row, Col } from "reactstrap";

class Estado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      colores: []
    };
  }

  componentDidMount() {
    const colores = DataService.getCategoriaHacienda();
    const data =
      this.props.type == "potreros"
        ? DataConvert.convertDetallesToModel(this.props.potreroDetalle, colores)
        : DataConvert.convertDetalleToModel(this.props.potreroDetalle, colores);
    console.log("data Original");
    console.log(data);
    this.setState({ data: data, colores: colores });
  }

  componentWillReceiveProps(nextProps) {
    const data =
      this.props.type == "potreros"
        ? DataConvert.convertDetallesToModel(
            nextProps.potreroDetalle,
            this.state.colores
          )
        : DataConvert.convertDetalleToModel(
            nextProps.potreroDetalle,
            this.state.colores
          );
    console.log("data actualizada");
    console.log(data);
    this.setState({ data: data });
  }

  render() {
    var data = [
      {
        values: this.state.data.map(item => item.value),
        labels: this.state.data.map(item => item.name),
        marker: {
          colors:this.state.data.map(item => item.color),
        },
        type: "pie"
      }
    ];

    var layout = {
      height: 400,
      width: 400
    };

    return (
      <div className={styles.estado} className="container text-center">
       <Plot data={data} layout={layout} />
      </div>
    );
  }
}

export default Estado;
