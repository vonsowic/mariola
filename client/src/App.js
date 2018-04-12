import React, {Component} from 'react';
import logo from './shovel.png';
import './App.css';
import Login from './Login';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import AvailableFaculties from './AvailableFaculties';
import JoinableFacs from "./JoinableFacs";
import UserComp from "./UserComp";
import JoinIn from "./JoinIn";
import FacultyNew from "./FacultyNew";
import Home from "./Home";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {logged: false};
        //sets auth header
        Login.setAxios();
    }

    logged() {
        if (document.cookie.indexOf("access_token") !== -1) {
            return true;
        }
        return false;
    }


    render() {
        const isLogged = this.logged();
        console.log(isLogged);
        const userData = isLogged ? (<UserComp/>) : (<p> Hej! Zaloguj się :)</p>);
        return (

            <Router>
                <div className="App">
                    <header className="App-header">
                        <Link to="/"> MARIOLA </Link>
                        <img src={logo} className="App-logo" alt="logo"/>
                        {userData}
                    </header>
                    <Switch>
                        <Route exact path="/" render={() => isLogged ? (<Home/>) : (<Redirect to="/login"/>)}/>
                        <Route exact path="/available" component={AvailableFaculties}/>
                        <Route exact path="/joinable" component={JoinableFacs}/>
                        <Route path="/joinable/join/:id" component={JoinIn}/>
                        <Route path="/available/new/:id" component={FacultyNew}/>
                        <Route exact path="/login" component={Login}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
