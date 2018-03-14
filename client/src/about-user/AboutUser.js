import React, { Component } from 'react';

class Login extends Component {
    state = {
        response: ''
    };

    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.user }))
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/users/me');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return (
            <div>
                {this.state.response}
            </div>
        );
    }
}

export default Login;
