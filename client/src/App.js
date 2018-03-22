import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';

import { Alert } from 'react-bootstrap';


class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <Login/>

          <Alert bsStyle="info">ract- bootstrap working</Alert>

      </div>
    );
  }
}

export default App;
