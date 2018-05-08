import React, {Component} from 'react';
import logo from './shovel.png';
import './cssData/App.css';
import Login from './Login';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import AvailableFaculties from './AvailableFaculties';
import JoinableFacs from "./JoinableFacs";
import UserComp from "./UserComp";
import JoinIn from "./JoinIn";
import FacultyNew from "./FacultyNew";
import Home from "./Home";
import Myplan from "./MyPlan";
import Menu from "./Menu";


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
        const userData = isLogged ? (<UserComp/>) : (<p> Hej! Zaloguj się :)</p>);
        const menu = isLogged ? (<Menu/>): (<p></p>);
        return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        {menu}
                        <img src={logo} className="App-logo" alt="logo"/>
                    </header>
                    <Switch>
                        <Route exact path="/" render={() => isLogged ? (<Home/>) : (<Redirect to="/login" push/>)}/>
                        <Route exact path="/available" component={AvailableFaculties}/>
                        <Route exact path="/joinable" component={JoinableFacs}/>
                        <Route path="/joinable/join/:id" component={JoinIn}/>
                        <Route path="/available/new/:id" component={FacultyNew}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/myplan" component={Myplan}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
