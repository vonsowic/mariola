const {
    isMembersNumberSmallerThanMaximum,
    transferStudent
} = require('./intention');

const transferStudentIfHisDreamedGroupBecameAvailable = db => userCourse =>
    db.Course
        .findById(userCourse.courseId)
        .then(async ({id}) => {
            if (await isMembersNumberSmallerThanMaximum(db, id)) {
                return db.Intention
                    .findAll({
                        where: {
                            forId: id
                        },
                        order: [
                            ['createdAt', 'ASC']
                        ]
                    })
                    .map(intention => transferStudent(db, intention))
            }
        });

module.exports={
    transferStudentIfHisDreamedGroupBecameAvailable
};