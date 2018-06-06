import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';


class JoinIn extends Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value})
    }


    handleSubmit(e) {
        const id = this.props.match.params.id;
        const groupName = e.target.value;
        axios.post("/api/faculties/join",
            {
                initialGroup: groupName,
                facultyId: id
            }).then((res) => {
            if (res.status === 201) {
                alert("dołączyłeś")
            }else if(res.status === 409 ){
                alert("jesteś już członkiem grupy lub grupa nie istnieje");
            }
            else {
                alert("spróbuj ponownie")
            }
        }).catch(err => {
            console.log('error: ', err.response);
            if(err.response.status === 409){
                alert('jesteś już członkiem grupu lub grupa nie istnieje')
            }
        });

        e.preventDefault();

    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Grupa zajęć do której chesz dołączyć:
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        );

    }
}

export default JoinIn;