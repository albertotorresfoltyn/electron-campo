import React, { Component } from 'react'
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import Button from 'react-bootstrap/Button';

import logo from './logo.svg'
import './App.css'
const cmp = ()=>(
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>
        {' '}
        Electron + React = <span> 😍 </span>{' '}
      </h2>{' '}
      <p>
        Edit <code> src / App.js </code> and save to reload.{' '}
      </p>{' '}
    </header>{' '}
     <Button variant = "primary" > Primary </Button>
  </div>
)

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      miValorLocal: 'Pablo se la come'
    }
  }

  render () {
    // this.setState({miValorLocal: null});
    return (
      <div>
      <Router>
        <div>
          <Route path="/" component={cmp} />{' '}
        </div>{' '}
      </Router>
      </div>
    )
  }
}

export default App
