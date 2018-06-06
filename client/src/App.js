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
import axios from 'axios';
import Sockette from 'sockette'
import * as utils from './utils';
import {toBigCalFormat} from "./utils";
import jwt_decode from 'jwt-decode';
import {getCookie} from "./utils";

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {

    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {

        originalRequest._retry = true;

        const refreshToken = utils.getCookie('refresh_token');
        return axios.get('/api/oauth/token/refresh', {headers: {'Authorization': "bearer " + refreshToken}})
            .then(({data}) => {
                document.cookie = `access_token=${data.token}`;
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
                originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
                return axios(originalRequest);
            });
    }

    return Promise.reject(error);
});

const ws = new Sockette('ws://localhost:5001', {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: e => handleSocketConn(e),
    onmessage: e => handleSocketMessage(e),
    onreconnect: e => console.log('Reconnecting...', e),
    onmaximum: e => console.log('Stop Attempting!', e),
    onclose: e => console.log('Closed!', e),
    onerror: e => console.log('Error:', e),
    protocols: 'echo-protocol'
});

function handleSocketMessage(data) {
    console.log('msg');
    console.log(data)
}

function handleSocketConn(evnt) {
    const token = getCookie('access_token');
    const decoded = jwt_decode(token);
    ws.json({
        userId: decoded.id,
        facultyIds: Object.keys(decoded.faculties)
    });
    setTimeout(handleSocketConn, 1000);

}


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            course: 1,
            ExchangeData: null
        };
        //sets auth header
        Login.setAxios();

        this.handleCourse = this.handleCourse.bind(this);


    }

    static hasToken() {
        if (document.cookie.indexOf("access_token") !== -1) {
            return true;
        }
        return false;
    }

    handleCourse(cID) {
        this.setState({course: cID});
        axios.get(`/api/plan/${cID}/general`)
            .then((res) => {
                this.setState({ExchangeData: res.data.map(toBigCalFormat)})
            });

        axios.get(`api/plan/${cID}/my?start=2017-06-18&end=2019-04-01`)
            .then(res => this.setState({planData: res.data}))

    }


    render() {
        const isLogged = App.hasToken();
        const menu = isLogged ? (<Menu setCourse={this.handleCourse}/>) : (<div></div>);
        return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        {menu}
                        <img src={logo} className="App-logo" alt="logo"/>

                    </header>
                    <Switch> tou
                        <Route exact path="/" render={() => isLogged ? (<Home/>) : (<Redirect to="/login" push/>)}/>
                        <Route exact path="/available" component={AvailableFaculties}/>
                        <Route exact path="/joinable" component={JoinableFacs}/>
                        <Route path="/joinable/join/:id" component={JoinIn}/>
                        <Route path="/available/new/:id" component={FacultyNew}/>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/myplan"
                               render={(fdefProps) => <Myplan data={this.state.planData} {...fdefProps}/>}/>
                        <Route exact path="/exchanges" render={(defProps) => <Exchange cId={this.state.course}
                                                                                       data={this.state.ExchangeData} {...defProps}/>}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
