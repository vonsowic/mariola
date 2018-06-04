import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import {toUserPlanFormat,getCookie} from "./utils";


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));


class MyPlan extends Component {
    constructor(props) {
        super(props);

        let values = [];
        if(this.props.data != undefined && this.props.data !== null ) {
            values = this.props.data.map(toUserPlanFormat);
        }
        this.state = {planData: values}
    }

   componentDidMount() {
       const id = getCookie("courseID");
        axios.get(`api/plan/${id}/my?start=2017-06-18&end=2019-04-01`)
            .then(res => this.setState({planData: res.data.map(toUserPlanFormat)}))
   }

    render() {
        console.log(this.state.planData[0]);

        return (<BigCalendar
            events={this.state.planData}
            views={["week"]}
            step={30}
            showMultiDayTimes
            defaultDate={new Date()}
            defaultView={"week"}
            min={new Date(2017, 10, 0, 7, 0, 0)}
            max={new Date(2017, 10, 0, 21, 0, 0)}
        />);
    }


}

export default MyPlan;