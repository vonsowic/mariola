import React, { Component } from 'react';
import FacebookLogin from "react-facebook-login";

class Login extends Component {
    render(){
        return (<FacebookLogin
            appId="2124361614460680"
            autoLoad={true}
            fields="name,email,picture"
            onClick={()=>{}}
            callback={this.callbackHandler()}
        />)
    }

    callbackHandler(){
        return res => this.authenticateWithApi(res)
            .then(this.saveToken)
    }

    authenticateWithApi(fbResponse){
        return fetch(`/api/oauth/facebook/token?access_token=${fbResponse.accessToken}`)
    }

    saveToken(apiResponse){
        apiResponse.json()
            .then(token => console.log(token))
    }
}

export default Login