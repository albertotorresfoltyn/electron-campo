// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Button, Row, Col, Container } from 'reactstrap';
import DataService from '../../services/DataService';

import {
  withRouter
} from 'react-router-dom';

class Potrero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      potrero: [],
    };
    
  }

  componentWillMount() {
    console.log(this.props)
    debugger;
    //this.props.match.params.campoId  Mandar tmb esto 
    this.setState({ potrero: DataService.getPotrero(this.props.match.params.potreroId, 1) });
    console.log(this.state.potrero)
  }

  render() {
    return (
      <div>
        <div  data-tid="container">
          <Container>
            <div className="text-center pt-md-5">
              <h1 className="display-4">POTRERO LPM!</h1>
              <span> {this.state.potrero[0].Idpotrero}</span>
             <span> {this.state.potrero[0].Descripcion}</span>
            
            </div>
          
          </Container>
        </div>
      </div>
    );
  }
}

export default withRouter(Potrero)
