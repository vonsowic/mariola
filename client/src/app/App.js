import React, { Component } from 'react';
import logo from '../logo.svg';
import './App.css';
import {Link, Route, BrowserRouter as Router} from 'react-router-dom';
import Login from '../login/Login'
import StudentsTimetable from '../students-timetable/StudentsTimetable'
import AboutUser from '../about-user/AboutUser'

class App extends Component {
    render() {
        return (
        <div className="App">
            <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
            </header>
            <Router>
                <div>
                    <ul>
                        <li>
                            <Link to="/mytimetable">Mój plan zajęć</Link>
                        </li>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/me">Me</Link>
                        </li>
                    </ul>

                    <hr />
                    <Route path="/mytimetable" component={StudentsTimetable} />
                    <Route path="/login" component={Login} />
                    <Route path="/me" component={AboutUser}/>
                </div>
            </Router>
        </div>
    );
  }
}

export default App;
