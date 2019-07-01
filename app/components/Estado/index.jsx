import React, { Component } from 'react';
import styles from './Estado.css';
import DataService from '../../services/DataService';
import {
  PieChart, Pie, Legend, Tooltip,
} from 'recharts';

class Estado extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorias: [],
    };




    
  }


componentWillMount() {
  this.setState({ categorias: DataService.getCategoriaHacienda() });

}




render() {

  const data01 = [
    { name: 'VACA', value: 250, indice:0 },
    { name: 'VAQUILLA', value: 300, indice:1},
    { name: 'TORO', value: 100, indice:2 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  const data02 = [
    { name: 'Group A', value: 2400 }, { name: 'Group B', value: 4567 },
    { name: 'Group C', value: 1398 }, { name: 'Group D', value: 9800 },
    { name: 'Group E', value: 3908 }, { name: 'Group F', value: 4800 },
  ];

  return (
  <div className={styles.estado} >
  <PieChart width={400} height={400}  >
    <Pie dataKey="value" isAnimationActive={false} data={data01} cx={200} cy={200} outerRadius={80} fill={COLORS[1]} label />
    <Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
    <Tooltip />
  </PieChart>
  </div>
  
  );
  }
}

export default Estado
