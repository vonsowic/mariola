import React, {Component} from 'react';
import axios from 'axios';


class ExchangeExtViev extends Component {
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.convertDay = this.convertDay.bind(this);
    }


    handleClick(e){
        axios.post("/api/exchanges",{
                forId: this.props.data.id
        }).then((r) => {console.log("this id: ",this.props.data.id);
        this.props.changeParSt(false)});
        e.preventDefault()
    }
    render(){
       const data = this.props.data;
        return(
        <div>
            <p> nazwa: {data.title}<br/>
                grupa bazowa: {data.group}<br/>
                dzień: {this.convertDay(data.dayOfWeek)} <br/>
                od: {data.start.getHours() + ":"  + data.start.getMinutes() + " "}
                do: {data.end.getHours() + ":"  + data.end.getMinutes()}
            </p>
            <button onClick={this.handleClick}>Wymień sie!</button>
        </div>
        );
    }






    convertDay(day){
        switch (day) {
            case 0:
                day = "Niedziela";
                break;
            case 1:
                day = "Poniedziałek";
                break;
            case 2:
                day = "Wtorek";
                break;
            case 3:
                day = "Środa";
                break;
            case 4:
                day = "Czwartek";
                break;
            case 5:
                day = "Piątek";
                break;
            case 6:
                day = "Sobota";
        }
        return day;
    }

}

export  default  ExchangeExtViev;