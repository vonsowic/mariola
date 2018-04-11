import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


class JoinFac extends Component {
    constructor(props){
        super(props);
        this.state = {data: []}
    }
    componentDidMount(){
        axios.get("/api/faculties").
        then((res) => this.setState({data: res.data}))
    }

    joinFaculty(id){

    }

    render(){
        const serverData = this.state.data;
        const renderThis = serverData.map((el) => <li key={el.id}> <Link to={"/signin/" + el.id}> {el.name} </Link> </li>);
        return (
            <ul>
                {renderThis}
            </ul>
        );
    }
}

export default JoinFac;