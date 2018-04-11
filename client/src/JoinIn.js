import React, {Component} from 'react';
import axios from 'axios';

class JoinIn extends Component{


    handleSubmit(event){
        axios.post("/api/faculties/join",{})
    }

    render(){
        console.log(this.props.match.params);
        return(
            <form onSubmit={this.handleSubmit.bind(this)}>
                <label>
                    Twoja grupa:
                    <input type="text" name="group"/>
                </label>
            </form>
        );
    }
}

export default JoinIn;