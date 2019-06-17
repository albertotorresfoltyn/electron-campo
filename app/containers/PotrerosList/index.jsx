// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Potrero.css';
import { Button, Row, Col, Container } from 'reactstrap';
import DataService from '../../services/DataService';
import PotreroCard from './PotreroCard';
import Estado from '../../components/Estado';
import {
  withRouter
} from 'react-router-dom';

class PotrerosList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      potreros: [],
    };
  }

  componentWillMount() {
    this.setState({ potreros: DataService.getPotreros(this.props.match.params.campoId) });
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <Container className="text-center">
            <div className="text-center pt-md-5">
              <h3 className="">POTREROS</h3>
            </div>
            <Row className="pt-md-5 text-center">
            {this.state.potreros.map(potrero => (
            
                <Col
                  key={potrero.IdPotrero}
                  md={{ size: 3 }}
                  className=""
                >
                  <PotreroCard potrero = {potrero} onClick={()=>{this.props.history.push('/potrero/'+potrero.IdPotrero)}}/>
                </Col>
                
              
            
              ))}  
              
               </Row>
               <div className="text-center pt-md-5">
              <h3>MAPA</h3>
            </div>
               <Row className="text-center">
                <img className="mx-auto" width="600" height="280" src="../app/assets/img/mapa.png" ></img>
               </Row>
               <div className="text-center pt-md-5">
              <h3>ESTADO</h3>
            </div>
             
              
            
             <Estado className="mx-auto" ></Estado>
             
                  
                  
              
            


          </Container>

          


        </div>
      </div>
    );
  }
}

export default withRouter(PotrerosList)
