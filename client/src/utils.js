import moment from 'moment'

const today   = new Date();
const tmof = - today.getTimezoneOffset();
const myMoment = (d) =>  typeof d !== "undefined" ? moment(d).utcOffset(tmof) : moment().utcOffset(tmof);


export function getCookie(cname) {
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

export function toUserPlanFormat(data) {
    return {
        id: data.id,
        title: data.name,
        start: new Date(data['courses_details.start']),
        end: new Date(data['courses_details.end']),
        other: data.other
    }
}

export function toBigCalFormat(data) {
    const wday = data.dayOfWeek;

    const startHour = moment(data.start, "HH:mm").format("H");
    const startMins = moment(data.start, "HH:mm").format("mm");
    const endHour = moment(data.end, "HH:mm").format("H");
    const endMins = moment(data.end, "HH:mm").format("mm");

    const tmpStart = myMoment().weekday(wday).hour(startHour).minute(parseInt(startMins));
    const tmpEnd = myMoment().weekday(wday).hour(endHour).minutes(parseInt(endMins));

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

function checkRangeAndFormat(data) {
    let hour = myMoment(data, "HH:mm").format("H");
    let intHour = parseInt(hour);
    const mins = myMoment(data, "HH:mm").format("mm");
    let finalTime = {hour: hour, mins: mins};
    if(intHour < 8) {
        finalTime.hour = force24hFormat(intHour)
    }
    return finalTime;
}

function force24hFormat(intHour) {
    //converts eg 02:30  to 14:30
    intHour = intHour + 12;
    return intHour
}

function notifyMe(notif) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications");
    }

    // Let's check whether notification permissions have already been granted
    else if (getCookie('notification_perm') === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(notif);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(notif);
            }
        });
    }
}
