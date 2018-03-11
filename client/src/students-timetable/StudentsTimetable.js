import React, { Component } from 'react';

class StudentsTimetable extends Component{
    state = {
        response: ''
    };

    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/hello');
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return (
            <div>
                <p>Message: {this.state.response}</p>
                <p>Tu będzie osobisty plan zajęć studenta</p>
            </div>
        );
    }
}

export default StudentsTimetable;
