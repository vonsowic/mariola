import React, { Component } from 'react';
import './Login.css';
import { FacebookLogin } from 'react-facebook-login-component';

class Login extends Component {
    render() {
        return (
        <div className="App">
        <FacebookLogin socialId="178886982730289"
                       language="en_US"
                       scope="public_profile,email"
                       responseHandler={response => console.log('Facebook response:', response)}
                       xfbml={true}
                       fields="id,email,name"
                       version="v2.5"
                       className="facebook-login"
                       buttonText="Login With Facebook"/>
        </div>
    );
  }
}

export default Login;
