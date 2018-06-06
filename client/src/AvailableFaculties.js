import React, { Component } from 'react';
import axios from 'axios';
import  { withRouter, Link} from 'react-router-dom';
import "./cssData/AvailablaFaculties.css"

class AvailableFaculties extends  Component {
    constructor(props){
        super(props);
        this.state = {faculties: []}
    }
    componentDidMount(){
         axios.get('api/faculties/available').
         then((resp) => {this.setState({faculties: resp.data})})

    }
    render(){
        const serverData = this.state.faculties;
        const renderThis = serverData.map((el) => <li key={el.id}> <Link className="AvailableLink" to={"/available/new/" + el.id}>{el.name + " semestr " + el.semester}</Link> </li>);
        return (
            <ul>
            {renderThis}
            </ul>
        );
    }


}


export default AvailableFaculties;