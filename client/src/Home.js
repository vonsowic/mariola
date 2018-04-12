import React , { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends  Component{


    render(){
        return(
            <ul>
                <li><Link to="/available"> Dodaj nowy kierunek </Link></li>
                <li><Link to="/joinable"> Dołącz </Link></li>
            </ul>

        );
    }

}


export default  Home;