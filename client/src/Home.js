import React , { Component } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css"

class Home extends  Component{


    render(){
        return(
            <ul>
                <li><Link className="Home-Nav" to="/available"> Dodaj nowy kierunek </Link></li>
                <li><Link className="Home-Nav" to="/joinable"> Dołącz </Link></li>
                <li><Link className="Home-Nav" to="/myplan">Mój plan</Link></li>
            </ul>

        );
    }

}


export default  Home;