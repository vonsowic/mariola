import React, { Component } from 'react';
import './Login.css';
import FacebookLogin from 'react-facebook-login';

class Login extends Component {
    sendFacebookResponse(response) {
        fetch(`/api/oauth/facebook?${Object.keys(response).map(k => k+'='+response[k]).join('&')}`)
    }

    render() {
        return (
            <FacebookLogin
                appId="1617633901657669"
                autoLoad={true}
                fields="name,email,picture"
                callback={this.sendFacebookResponse}
                icon="fa-facebook"/>
    );
  }
}

export default Login;
