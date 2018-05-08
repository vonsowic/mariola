import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

let allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k]);
let myView = {MONTH: "month", WEEK: "week",DAY: "day"};


class MyPlan extends Component {


    render() {
        const events = [
            {
                id: 0,
                title: 'Algorytmy',
                start: new Date(2018, 4, 9, 10, 30, 0, 0),
                end: new Date(2018, 4, 9, 12, 30, 0, 0),
            },
            {
                id: 1,
                title: 'Zagadki logiczne',
                start: new Date(2018, 4, 12, 17, 0, 0, 0),
                end: new Date(2018, 4, 12, 17, 30, 0, 0),
                desc: 'ważne!',
            },
            {
                id: 2,
                title: 'konkurs na najlepszy fikołek',
                start: new Date(2018, 4, 7, 12, 0, 0, 0),
                end: new Date(2018, 4, 7, 15, 30, 0, 0),
                desc: 'ważne!',
            }
        ];
        return (<BigCalendar
            events={events}
            views={["week"]}
            step={60}
            showMultiDayTimes
            defaultDate={new Date(2018, 4, 11)}
            defaultView={"week"}
        />);
    }


}

export default MyPlan;