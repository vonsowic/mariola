import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FacebookLogin from "react-facebook-login";

class App extends Component {

    componentDidMount(){
        fetch('/hello').then(res => {
            console.log(res)
        });
    }

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
          <FacebookLogin
              appId="2124361614460680"
              autoLoad={true}
              fields="name,email,picture"
              onClick={()=>{}}
              callback={(res)=> {
                  console.log(res);
                  fetch(`/api/oauth/facebook/token?access_token=${res.accessToken}`)
                      .then(res => {
                        console.log('Response from api:', res)
                      })
              }} />
      </div>
    );
  }
}

export default App;
