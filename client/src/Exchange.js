import React, {Component} from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios';
import ExchangeExtViev from "./ExchangeExtViev";


BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));



class Exchange extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bAddInfo:false,
            activeEvent:{},
            courses: [],
        cID: this.props.cId};

        //to set timezene
        const today   = new Date();
        const tmof = - today.getTimezoneOffset();
        this.moment = (d) =>  typeof d !== "undefined" ? moment(d).utcOffset(tmof) : moment().utcOffset(tmof);

        this.toBigCalFormat = this.toBigCalFormat.bind(this);
        this.checkRangeAndFormat = this.checkRangeAndFormat.bind(this);
        this.force24hFormat = this.force24hFormat.bind(this);
        this.handleSelectEvent = this.handleSelectEvent.bind(this);


    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // Store prevUserId in state so we can compare when props change.
        // Clear out any previously-loaded user data (so we don't render stale stuff).
        if (nextProps.cId !== prevState.cID) {
            return {
               cID:nextProps.cID,
                profileOrError: null,
            };
        }

        // No state update necessary
        return null;
    }


    componentDidMount() {
        console.log("compoment did mount");
        const id = Exchange.getCookie("courseID");
        //defaults to 1
        const course = id ? id : 1;
        //const course  = this.props.cId
        axios.get("/api/plan/" + course + "/general")
            .then((res) => {
               // this.setState({courses: res.data});

               const fromEvents = res.data.map(this.toBigCalFormat);
               //  const fromEvents = this.toBigCalFormat(res.data[2]);
                this.setState({courses: fromEvents});
               //  console.log(this.state.courses[2])
            })
    }

    ComponentDidUpdate(prevProps, prevState) {
        const course = this.props.cId;
        axios.get("/api/plan/" + course + "/general")
            .then((res) => {
                // this.setState({courses: res.data});

                const fromEvents = res.data.map(this.toBigCalFormat);
                //  const fromEvents = this.toBigCalFormat(res.data[2]);
                this.setState({courses: fromEvents,
                    cID: this.props.cId});
                //  console.log(this.state.courses[2])
            });


    }

    static  getCookie(cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
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
            end: tmpEnd.toDate(),
            //additional info
            group: data.group,
            dayOfWeek : wday
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

    handleSelectEvent(e) {
        this.setState({
            bAddInfo: true,
            activeEvent: e})
    }



    render() {
        const additEl = this.state.bAddInfo ? <ExchangeExtViev data={this.state.activeEvent} changeParSt={(bst) => this.setState({bAddInfo: bst})}/> :
            <p>Wymiany</p>;


        return (
        <div>
            {additEl}
            <BigCalendar
            events={this.state.courses}
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