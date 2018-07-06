const {
    isMembersNumberSmallerThanMaximum,
    transferStudent
} = require('./intention');

const transferAllWithoutExchangeIfPossible = db => faculty => {
    if (faculty.exchangesEnabled && faculty.transferWithoutExchangeEnabled) {
        return db.Intention
            .findAll({
                include: [{
                    model: db.Course,
                    as: 'what',
                    attributes: [],
                    where: {
                        facultyId: faculty.id
                    },
                    through: false
                }],
                order: [
                    ['createdAt', 'ASC']
                ]
            })
            .filter(async i => (await isMembersNumberSmallerThanMaximum(db, i.forId)))
            .map(i => transferStudent(db, i))
    }
};

module.exports={
    transferAllWithoutExchangeIfPossible
};