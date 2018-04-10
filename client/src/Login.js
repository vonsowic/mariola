import React, { Component } from 'react';
import FacebookLogin from "react-facebook-login";
import axios from 'axios';

class Login extends Component {

    render(){
        return (<FacebookLogin
            appId={process.env.CLIENT_ID}
            autoLoad={true}
            fields="name,email,picture"
            onClick={()=>{}}
            callback={this.callbackHandler()}
        />)
    }

    callbackHandler(){
        return res => this.authenticateWithApi(res).then(this.setAxios())

    }

    authenticateWithApi(fbResponse){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');

        return fetch(`/api/oauth/facebook/token?access_token=${fbResponse.accessToken}`, {
            method: 'GET',
            mode: 'same-origin',
            redirect: 'follow',
            credentials: 'include', // Don't forget to specify this if you need cookies
            headers: headers,

        });

    }

    setAxios(){
        axios.defaults.headers.common['Authorization'] = "bearer "
            + document.cookie.slice(document.cookie.indexOf("access_token")+13);
    }
}

export default Login