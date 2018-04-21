import React , { Component } from 'react';
import { Link } from 'react-router-dom';
import "./cssData/Home.css"
import MyPlan from "./MyPlan";
import Menu  from "./Menu";

class Home extends  Component{


    render(){
        return(
            <MyPlan/>
        );
    }

}


export default  Home;