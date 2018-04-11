import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';


class FacultyNew extends Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value})
    }

    validateName(name) {
        if (name.length === 0 || name.replace(/\s/g, '').length === 0) {
            return false;
        }
        return true;
    }

    handleSubmit(e) {
        const id = this.props.match.params.id;
        const nameData = e.target.value;
        if (this.validateName(nameData)) {
            axios.post("/api/faculties/create",
                {
                    name: nameData,
                    facultyId: id
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
                    Nazwa Grupy:
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        );

    }
}

export default FacultyNew;