import React, {Component} from 'react';
import FacebookLogin from "react-facebook-login";
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import Exchange from "./Exchange";


class Login extends Component {

    render() {

        return (
            <FacebookLogin
                appId={process.env.CLIENT_ID}
                autoLoad={true}
                fields="name,email,picture"
                onClick={() => {this.props.history.push("/");}}
                callback={this.callbackHandler()}
            />
        );
    }

    callbackHandler() {
        return res => this.authenticateWithApi(res).then(() =>
            Login.setAxios())

    }

    authenticateWithApi(fbResponse) {
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

    static setAxios() {
        if (document.cookie.indexOf("access_token") !== -1) {
            axios.defaults.headers.common['Authorization'] = "bearer "
                + Exchange.getCookie("access_token");
        }
    }
}

export default withRouter(Login);