import React, { Component } from 'react';
import axios from 'axios';
import Faculty from "./Faculty";


class  UserComp extends Component {
    constructor(props){
        super(props);
        this.state = {name: '',
        surname: '',
        myfacultues: []}
    }
    componentDidMount(){
        axios.get("/api/users/me").
        then((res) => this.setState({
            name: res.data.name,
            surname: res.data.lastName,
            myfaculties: res.data.faculties
        }))
    }

    render(){
        const facs = this.state.myfacultues.map((el) => <li><Faculty data={el}/></li>);
        return(
            <div>
                {this.state.name + " " + this.state.surname}
             <ul>
                 {facs}
             </ul>
            </div>
        );
    }
}

export default UserComp;