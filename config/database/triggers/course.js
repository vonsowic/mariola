const getDefaultMaxStudentsNumber = group => {
    if ( group === '0') {
        return 999
    } else if (group.length === 1){
        return 30
    } else {
        return 15
    }
};

const insertDefaultMaxStudentsNumber = record => {
    if(!record.maxStudentsNumber){
        record.maxStudentsNumber = getDefaultMaxStudentsNumber(record.group)
    }
};

module.exports={
    insertDefaultMaxStudentsNumber
};