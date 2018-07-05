const removeUsersDataAfterLeaving = db => userFaculty => {
    db.UserCourse.delete({
        where: {
            userId: userFaculty.userId,
            courseId: db.connection.literal(`in (SELECT id FROM courses WHERE "facultyId"=${userFaculty.facultyId})`)
        },
    });

    db.Intention.delete({
        where: {
            userFrom: userFaculty.userId,
            whatId: db.connection.literal(`in (SELECT id FROM courses WHERE "facultyId"=${userFaculty.facultyId})`)
        },
    })
};

module.exports={
    removeUsersDataAfterLeaving
};