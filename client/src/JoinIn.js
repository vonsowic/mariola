import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import  {DropdownButton,MenuItem,SplitButton} from 'react-bootstrap'
import "./cssData/JoinIn.css"

class JoinIn extends Component {

    constructor(props) {
        super(props);
        this.state = {value: '',groups:[]};

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get('/api/faculties/' + id +'/groups')
            .then(res => this.setState({groups:res.data}) )
    }
    handleChange(e) {
        this.setState({value: e.target.value})
    }


    handleSubmit(e) {
        const id = this.props.match.params.id;
        const groupName = this.state.value;
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
        const dropDownValues = this.state.groups.map(x => <option value={x}>{x}</option>);
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    <h3>Grupa zajęć do której chesz dołączyć:</h3>
                </label> <br/>
                    <select className="SelectC" onChange={this.handleChange}>
                        {dropDownValues}
                    </select>
                <p>     </p>
                <input className="SubmitBtt" type="submit" value="Dołącz"/>
            </form>
        );

    }
}

export default JoinIn;