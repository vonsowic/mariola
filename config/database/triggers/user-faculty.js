const { Conflict } = require('utils/errors');

const removeUsersDataAfterLeaving = db => userFaculty => {
    db.UserCourse.delete({
        where: {
            userId: userFaculty.userId,
            courseId: db.connection.literal(`in (SELECT id FROM courses WHERE "facultyId"=${userFaculty.facultyId})`)
        },
    });

    db.Intention.delete({
        where: {
            fromId: userFaculty.userId,
            whatId: db.connection.literal(`in (SELECT id FROM courses WHERE "facultyId"=${userFaculty.facultyId})`)
        },
    })
};

const ensureAdminWontBeBanned = () => async userFaculty => {
    console.log(userFaculty)
    if( userFaculty.isAdmin && userFaculty.isBanned) {
        throw new Conflict('Admin cannot be banned')
    }

    return true
};

module.exports={
    removeUsersDataAfterLeaving,
    ensureAdminWontBeBanned
};