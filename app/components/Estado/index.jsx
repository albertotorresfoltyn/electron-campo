import React, { Component } from "react";
import styles from "./Estado.css";

import DataConvert from "../../utils/DataConvert";
import DataService from "../../services/DataService";
import { PieChart, Pie, Legend, Tooltip, Cell, Sector } from "recharts";
import {
  Row,
  Col
} from 'reactstrap';

class Estado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    
    };
   
   
  }

  componentDidMount() {

    const colores = DataService.getCategoriaHacienda();
    const data =  this.props.type == "potreros" ? DataConvert.convertDetallesToModel(this.props.potreroDetalle, colores) : DataConvert.convertDetalleToModel(this.props.potreroDetalle, colores);
   
    this.setState({ data:data });
   
  }


 

  render() {
   
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      index
    }) => {
      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);

      return (
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      );
    };

    return (
      <div className={styles.estado} className="container">
        <Row>
          <Col md="3" style={{
                      marginTop: 120
                    }}>
          {this.state.data.map((items, i) => (
          
          <div className="row">
            {
              <div>
                <span className="mr-2">
                  <i
                    className="fas fa-circle"
                    style={{
                      color: items.color
                    }}
                  ></i>{" "}
                </span>
<span className="text-dark">{items.name}</span>
                
              </div>
            }
        </div>
      ))}
          </Col>
          <Col md="9">

          <PieChart width={400} height={400}>
          <Pie
            data={this.state.data}
            cx={200}
            cy={200}
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={80}
            dataKey="value"
          >
            {this.state.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
          </Pie>
         
        <Pie data={this.state.data} dataKey="value" cx={200} cy={200} innerRadius={70} outerRadius={90} fill="#82ca9d" label>
        { this.state.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
        </Pie>
        </PieChart>
          </Col>

      

        </Row>
         
        

      </div>
    );
  }
}

export default Estado;
