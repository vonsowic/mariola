import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';





class App extends Component {

    onClickHandler(){
        console.log("clicked");
        axios.get("/api/users/me").then((res) => {console.log(res)});
    }

  render() {
    return (
      <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
        </header>
        <Login/>
      </div>
    );
  }
}

export default App;
