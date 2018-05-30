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
import  axios from 'axios';
import jwt_decode from 'jwt-decode'

// axios.interceptors.response.use(undefined, function (error) {
//     console.log("401 interceptor");
//     const orginalRequest = error.config;
//     if (401 === error.response.status && ! error.config.__isRetryRequest) {
//         Login.setAxios("refresh_token");
//         axios.get("/api/oauth/token/refresh").
//         then(res =>{
//             if(App.hasToken()) {
//                 document.cookie = `access_token=${res.data.token}`;
//                 Login.setAxios();
//                 error.config.__isRetryRequest = true;
//                 return axios(orginalRequest)
//             }else {
//                this.props.history.push("/login")
//             }
//         })
//
//     } else {
//         return Promise.reject(error);
//     }
// });f 

// axios.interceptors.request.use(config => {
//     const orginalRequest  = config;
//     const url = window.location.href;
//     console.log('intercepted');
//     if(url.search('/login') === -1 &&  isOutdated(Exchange.getCookie('access_token'))){
//         Login.setAxios('refresh_token');
//         console.log('refreshin gtoken');
//         axios.get('/api/oauth/token/refresh')
//             .then(res =>{
//                 document.cookie = `access_token=${res.data.token}`;
//                 console.log('token refreshed');
//                 Login.setAxios();
//                 return Promise.resolve(orginalRequest);
//             })
//     }
//     return config;
// });


//q2
// axios.interceptors.request.use((config) => {
//     let originalRequest = config;
//     const url = window.location.href;
//     if (App.hasToken() && isOutdated(Exchange.getCookie('access_token')) && url.search('/login') === -1
//     &&  originalRequest.url !== '/api/oauth/token/refresh') {
//         console.log('refreshing');
//           return issueToken().then((res) => {
//             console.log(res);
//             document.cookie = `access_token=${res.data.token}`;
//             originalRequest['Authorization'] = 'Bearer ' + res.data.token;
//             Login.setAxios();
//             return Promise.resolve(originalRequest);
//         });
//     }
//     if(config.url === '/api/oauth/token/refresh'){
//         config.headers['Authorization'] = 'Bearer ' + Exchange.getCookie('refresh_token');
//     }
//         return config;
// }, (err) => {
//     return Promise.reject(err);
// });


axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {

    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {

        originalRequest._retry = true;

        const refreshToken = Exchange.getCookie('refresh_token');
        return axios.get('/api/oauth/token/refresh',{ headers: {'Authorization': "bearer " + refreshToken} })
            .then(({data}) => {
                document.cookie = `access_token=${data.token}`;
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
                originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
                return axios(originalRequest);
            });
    }

    return Promise.reject(error);
});

function issueToken() {
    return new Promise((resolve, reject) => {
        return axios.get('/api/oauth/token/refresh')
            .then((response) => {
            resolve(response);
        }).catch((err) => {
            reject(err);
        });
    });
}

function isOutdated(JWTtoken) {
    const decoded = jwt_decode(JWTtoken);
    const tokenExp = decoded.exp;
    const currTime = new Date().getTime();
    if(currTime >= tokenExp * 1000 ){ //cuz shit ain't match
        console.log('outdated');
        return true;
    }
    return false;

}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {logged: false,
        course: 1};
        //sets auth header
        Login.setAxios();

        this.handleCourse = this.handleCourse.bind(this)
    }

    static hasToken() {
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
        const isLogged = App.hasToken();
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
