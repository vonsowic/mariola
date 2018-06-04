import React, {Component} from 'react';
import {Navbar, NavItem, Nav, NavbarBrand, NavDropdown, MenuItem} from 'react-bootstrap';
import {Link} from "react-router-dom";
import "./cssData/Menu.css"
import axios from 'axios';

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            surname: '',
            myfaculties: [],
            faculties: []
        };
        this.handleSelect = this.handleSelect.bind(this);
    }

    componentDidMount() {
        function getUser() {
            return axios.get("/api/users/me");
        }

        function getFaculties() {
            return axios.get("/api/faculties?onlyMy?=true")
        }

        axios.all([getUser(), getFaculties()])
            .then(axios.spread(
                (resp1, resp2) => {
                    this.setState({
                        name: resp1.data.name,
                        surname: resp1.data.lastName,
                        myfaculties: resp1.data.faculties,
                        faculties: resp2.data
                    })
                }
            ));

    }

    handleSelect(eventKey,event) {
       if(eventKey >5) {
           const key = eventKey - 5; // parseInt((eventKey - 5) *10);
           document.cookie = "courseID=" + key;
           this.props.setCourse(key);
       }

    }

    render() {
        console.log(document.cookie);
        const userName = this.state.name + " " + this.state.surname;
        let facultiesDrop = this.state.faculties.map((dt) => <MenuItem eventKey={5 + dt.id } key={dt.id}>{dt.name}</MenuItem>);
        return (
            <Navbar className="Whole-Navbar" onSelect={this.handleSelect}>
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
                    <NavItem eventKey={3}>
                        <Link className="Home-Nav" to="/myplan">Mój plan</Link>
                    </NavItem>
                    <NavItem eventKey={4}>
                        <Link className="Home-Nav" to="/exchanges">Wymiany</Link>
                    </NavItem>
                </Nav>
                <Nav pullRight>
                    <NavDropdown eventKey={5} title={userName} id={"dropID"}>
                        {facultiesDrop}
                    </NavDropdown>

                </Nav>

            </Navbar>
        );
    }


}


export default Menu;