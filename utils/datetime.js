const getDate=(dayOfWeek)=>{
    let todayDate = new Date();
    let today = todayDate.getDay();
    return new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate() - today + dayOfWeek
    )
};

const getMondayDate=()=>getDate(1);

const getSundayDate=()=>getDate(7);



module.exports={
    getMondayDate,
    getSundayDate
};