import React, { Component } from 'react';


class Faculty extends Component{

    render(){
        const name = this.props.data.name;
        return(
            {name}
        );
    }
}
export  default Faculty;