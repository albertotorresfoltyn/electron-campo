import React, { Component } from "react";
import styles from "./Estado.css";
import DataService from "../../services/DataService";
import { PieChart, Pie, Legend, Tooltip, Cell, Sector } from "recharts";

class Estado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.convertDetalleToEntity = this.convertDetalleToEntity.bind(this);
  }

  componentWillMount() {
    this.setState({ data: this.convertDetalleToEntity(this.props.potreroDetalle) });
    
  }

  convertDetalleToEntity(listDetalle) {
    if(listDetalle != undefined){
      const result = [];
      const colores = this.props.colores;
      listDetalle.map((item, i) => {
        const elem = {
          name: item.type,
          value: item.total,
          indice: i,
          color: colores.find(e=> e.Nombre.toUpperCase() == item.type.toUpperCase()).Color
        };
        result.push(elem);
      });
      console.log("result");
      console.log(result);
      return result;
  
    }
   
   
    
  }
 

  render() {
     const data = [
      { name: 'Group A', value: 400 , color:'#0088FE'},
      { name: 'Group B', value: 300 , color:'#FF8042'},
      { name: 'Group C', value: 300 , color:'#0088FE'},
      { name: 'Group D', value: 200 , color:'#00C49F'},
    ];
   
    

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
      <div className={styles.estado}>
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
        {this.state.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
        </Pie>
        </PieChart>

      </div>
    );
  }
}

export default Estado;
