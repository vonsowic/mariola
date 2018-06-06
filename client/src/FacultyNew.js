import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import "./cssData/FacultyNew.css"

class FacultyNew extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleGroup = this.handleGroup.bind(this);
    }

    handleName(e) {
        this.setState({value: e.target.value})
    }

    handleGroup(e) {
        this.setState({group: e.target.value})
    }

    validateName(name) {
        if(typeof name === 'string') {
            if (name.length === 0 || name.replace(/\s/g, '').length === 0) {
                return false;
            }
            return true;
        }
        return false;
    }

    handleSubmit(e) {
        const id = this.props.match.params.id;
        console.log('id', id);
        const nameData = this.state.value;
        if (this.validateName(nameData)) {
            axios.post("/api/faculties/create",
                {
                    name: nameData,
                    facultyId: id,
                    initialGroup: this.state.group
                }).then((res) => {
                if (res.status === 201) {
                    alert("grupa stworzona")
                } else {
                    alert("spróbuj ponownie")
                }
            }).catch((err => console.log(err)));
        }else{
            alert("błędna nazwa");
        }
        e.preventDefault();

    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Nazwa nowej grupy:
                </label>
                <br/>
                    <input type="text" value={this.state.value} onChange={this.handleName}/>
                <br/>
                <label>
                bazowa grupa dziekanatowa:
                </label>
                <br/>
                    <input type="text" value={this.state.group} onChange={this.handleGroup}/>
                <br/> <br/>
                <input className="SubmitBtt" type="submit" value="Stwórz"/>
            </form>
        );

    }
}

export default FacultyNew;