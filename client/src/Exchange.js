import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios';


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));



class Exchange extends Component {

    constructor(props) {
        super(props);
        this.state = {
            baseCourses:[],
            courses: []};

        //to set timezene
        const today   = new Date();
        const tmof = - today.getTimezoneOffset();
        this.moment = (d) =>  typeof d !== "undefined" ? moment(d).utcOffset(tmof) : moment().utcOffset(tmof);

        this.toBigCalFormat = this.toBigCalFormat.bind(this);
        this.checkRangeAndFormat = this.checkRangeAndFormat.bind(this);
        this.force24hFormat = this.force24hFormat.bind(this);
    }

    componentDidMount() {
        //hardcoded for now
        const course = 3;
        axios.get("/api/plan/" + course + "/general")
            .then((res) => {
               // this.setState({courses: res.data});

               const fromEvents = res.data.map(this.toBigCalFormat);
               //  const fromEvents = this.toBigCalFormat(res.data[2]);
                this.setState({courses: fromEvents});
               //  console.log(this.state.courses[2])
            })
    }

    toBigCalFormat(data) {
        const wday = data.dayOfWeek;
        const startFormated = this.checkRangeAndFormat(data.start);
        const endFormated = this.checkRangeAndFormat(data.end);

        const tmpStart = this.moment().weekday(wday).hour(startFormated.hour).minute(parseInt(startFormated.mins));
        const tmpEnd = this.moment().weekday(wday).hour(endFormated.hour).minutes(parseInt(endFormated.mins));
        return {
            id: data.id,
            title: data.name,
            //works only for curr week for  now
            start: tmpStart.toDate(),
            end: tmpEnd.toDate()
        }

    }

    checkRangeAndFormat(data) {
        let hour = moment(data, "HH:mm").format("H");
        let intHour = parseInt(hour);
        const mins = moment(data, "HH:mm").format("mm");
        let finalTime = {hour: hour, mins: mins};
        if(intHour < 8) {
            finalTime.hour = this.force24hFormat(intHour)
        }
        return finalTime;
    }
    force24hFormat(intHour) {
        //converts eg 02:30  to 14:30
        intHour = intHour + 12;
        return intHour
    }

    render() {

        return (<BigCalendar
            events={this.state.courses}
            views={["week","day"]}
            step={30}
            showMultiDayTimes
            defaultDate={new Date(2018, 4, 11)}
            defaultView={"week"}
            onSelectEvent={(event, e) => console.log(event)}
        />);
    }


}

export default Exchange;