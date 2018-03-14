import React, { Component } from 'react';
import './Login.css';
import FacebookLogin from 'react-facebook-login';

class Login extends Component {
    loginFlow(){
        fetch("/api/oauth/facebook", {'mode': 'no-cors'})
    }

    render() {
        return (
            <div>
            <FacebookLogin
                appId="1617633901657669"
                autoLoad={true}
                fields="name,email,picture"
                callback={this.loginFlow}/>
            <button onClick={this.loginFlow}>Login with facebook</button>
            </div>
        );
  }
}

export default Login;
