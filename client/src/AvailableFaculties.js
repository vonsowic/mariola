import React, { Component } from 'react';
import axios from 'axios';
import  { withRouter, Link} from 'react-router-dom';

class AvailableFaculties extends  Component {
    constructor(props){
        super(props);
        this.state = {faculties: []}
    }
    componentDidMount(){
         axios.get('api/faculties/available').
         then((resp) => {this.setState({faculties: resp.data})}).
         catch((err) => {console.log(err);
         this.nextPath("/")});

    }
    render(){
        const serverData = this.state.faculties;
        const renderThis = serverData.map((el) => <li key={el.id}> <Link to={"/faculty/new/" + el.id}>{el.name + " semestr " + el.semester}</Link> </li>);
        return (
            <ul>
            {renderThis}
            </ul>
        );
    }
}


export default AvailableFaculties;