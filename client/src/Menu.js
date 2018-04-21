import React , { Component } from 'react';
import {Navbar, NavItem,Nav,NavbarBrand,} from 'react-bootstrap';
import {Link} from "react-router-dom";
import "./cssData/Menu.css"
import UserComp from "./UserComp";

class Menu extends Component {

    render(){
        return(
            <Navbar className="Whole-Navbar">
                <Navbar.Header>
                    <NavbarBrand>
                        <Link className="Home-Link" to="/"> MARIOLA </Link>
                    </NavbarBrand>
                </Navbar.Header>
                <Nav className="Nav">
                    <NavItem eventKey={1}>
                        <Link className="Home-Nav" to="/available"> Dodaj nowy kierunek </Link>
                    </NavItem>
                    <NavItem eventKey={2}>
                        <Link className="Home-Nav" to="/joinable"> Dołącz </Link>
                    </NavItem>
                    <NavItem eventKey={2}>
                        <Link className="Home-Nav" to="/myplan">Mój plan</Link>
                    </NavItem>
                </Nav>
                <Nav pullRight>
                    <NavItem>
                        <UserComp/>
                    </NavItem>
                </Nav>

            </Navbar>
        );
    }


}


export default Menu;