const {
    Locked
} = require('utils/errors');


const getDefaultMaxStudentsNumber = group => {
    if (group.length === 1){
        return 30
    } else if(group.length === 2) {
        return 15
    } else {
        return null
    }
};

const insertDefaultMaxStudentsNumber = () => record => {
    if(!record.maxStudentsNumber){
        record.maxStudentsNumber = getDefaultMaxStudentsNumber(record.group)
    }
};

const ensureMaxNumberOfStudentsCanBeUpdated = db => course =>
    db.Faculty
        .findById(course.facultyId)
        .then(faculty => {
            if(faculty.transferWithoutExchangeEnabled) {
                throw new Locked("You can't modify this property when transfer without exchange is enabled")
            }
        });

module.exports={
    insertDefaultMaxStudentsNumber,
    ensureMaxNumberOfStudentsCanBeUpdated
};