import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios';
import ExchangeExtViev from "./ExchangeExtViev";
import {toBigCalFormat,getCookie} from "./utils";

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));



class Exchange extends Component {

    constructor(props) {
        super(props);
        let values = [];
        if(this.props.data !== 'undefined'  && this.props.data !== null ) {
             values = this.props.data.map(toBigCalFormat);
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
        const id = getCookie("courseID");
        //defaults to 1
        const course = id ? id : 1;
        axios.get("/api/plan/" + course + "/general")
            .then((res) => {
                this.setState({courses: res.data.map(toBigCalFormat)})
            })
    }



    render() {

        const additEl = this.state.bAddInfo ? <ExchangeExtViev data={this.state.activeEvent} changeParSt={(bst) => this.setState({bAddInfo: bst})}/> :
            <h3>Wymiany</h3>;
        const renderTable = typeof this.props.data  !== 'undefined' && this.props.data !== null ? this.props.data : this.state.courses;
        return (
        <div>
            {additEl}
            <BigCalendar
            events={renderTable}
            views={["week","day"]}
            step={30}
            showMultiDayTimes
            defaultDate={new Date()}
            defaultView={"week"}
            onSelectEvent={this.handleSelectEvent}
            min={new Date(2017, 10, 0, 7, 0, 0)}
            max={new Date(2017, 10, 0, 21, 0, 0)}
        />
        </div>);
    }


}

export default Exchange;