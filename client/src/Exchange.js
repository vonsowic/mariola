import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios';
import ExchangeExtViev from "./ExchangeExtViev";
import  * as utils from './utils';
import {toBigCalFormat} from "./utils";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));



class Exchange extends Component {

    constructor(props) {
        super(props);
        let values = [];
        console.log('const', this.props.cID);
        if(this.props.data !== 'undefined'  && this.props.data !== null ) {
             values = this.props.data.map(utils.toBigCalFormat);
        }
        this.state = {
            bAddInfo:false,
            activeEvent:{},
            courses: values,
        cID: this.props.cId
        };
        this.handleSelectEvent = this.handleSelectEvent.bind(this);
    }

   handleSelectEvent(e) {
        this.setState({
            bAddInfo: true,
            activeEvent: e})
    }

    componentDidMount() {
        const id = utils.getCookie("courseID");
        //defaults to 1
        const course = id ? id : 1;
        //const course  = this.props.cId
        axios.get("/api/plan/" + course + "/general")
            .then((res) => {
               const fromEvents = res.data.map(utils.toBigCalFormat);
               //this.setState({cour: fromEvents});
                this.setState({courses: res.data.map(toBigCalFormat)})

            })
    }



    render() {

        const additEl = this.state.bAddInfo ? <ExchangeExtViev data={this.state.activeEvent} changeParSt={(bst) => this.setState({bAddInfo: bst})}/> :
            <h3>Wymiany</h3>;
        const renderTable = typeof this.props.data  !== 'undefined' && this.props.data !== null ? this.props.data : this.state.courses;
        const ren = renderTable === null ? [] : renderTable
        return (
        <div>
            {additEl}
            <BigCalendar
            events={ren}
            views={["week","day"]}
            step={30}
            showMultiDayTimes
            defaultDate={new Date()}
            defaultView={"week"}
            onSelectEvent={this.handleSelectEvent}
        />
        </div>);
    }


}

export default Exchange;