import React, { Component } from 'react';
import logo from './shovel.png';
import './App.css';
import Login from './Login';
import {BrowserRouter as Router ,Route, Link, Switch} from 'react-router-dom';
import AvailableFaculties from './AvailableFaculties';
import JoinFac from "./JoinFac";
import UserComp from "./UserComp";
import JoinIn from "./JoinIn";
import FacultyNew from "./FacultyNew";





class App extends Component {

    constructor(props){
        super(props);
        this.state = {logged: false};
        //sets auth header
        Login.setAxios();
    }


    logged(){
        if(document.cookie.indexOf("acccess_token") !== -1){
            this.setState({logged: true});
            return true;
        }
        return false;
    }

  render() {
      const isLogged = this.logged();
      const toRender = isLogged ? (<Login/>) :
          (<ul>
              <li><Link to="/available"> Dodaj nowy kierunek </Link></li>
              <li><Link to="/join"> Dołącz </Link></li>
          </ul>);

    return (


        <Router>
        <div className="App">
        <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <UserComp/>
        </header>

            {toRender}
            <Switch>
                <Route exact path="/available" component={AvailableFaculties}/>
                <Route exact path="/join" component={JoinFac}/>
                <Route path="/join/:id" component={JoinIn} />
                <Route path="/faculty/new/:id" component={FacultyNew}/>
            </Switch>
        </div>
        </Router>
    );
  }
}

export default App;
