import React, {Component} from 'react';
import logo from './shovel.png';
import './cssData/App.css';
import Login from './Login';
import {BrowserRouter as Router, Route, Link, Switch, Redirect} from 'react-router-dom';
import AvailableFaculties from './AvailableFaculties';
import JoinableFacs from "./JoinableFacs";
import JoinIn from "./JoinIn";
import FacultyNew from "./FacultyNew";
import Home from "./Home";
import Myplan from "./MyPlan";
import Menu from "./Menu";
import Exchange from "./Exchange";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {logged: false,
        course: 1};
        //sets auth header
        Login.setAxios();

        this.handleCourse = this.handleCourse.bind(this)
    }

    logged() {
        if (document.cookie.indexOf("access_token") !== -1) {
            return true;
        }
        return false;
    }

    handleCourse(cID) {
        console.log(cID);
        this.setState({course: cID});
    }





    render() {
        const isLogged = this.logged();
        const menu = isLogged ? (<Menu setCourse={this.handleCourse}/>): (<p></p>);
        const exch =   () => <Exchange cId={this.state.course}/>;
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
                        <Route exact path="/exchanges" render={exch}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
