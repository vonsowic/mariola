const db = require('database');

const findAllIntentionsByFacultyId = facultyId =>
    db.ExchangeIntention
        .findAll({
            attributes: ['id', 'whatId', 'forId', 'userFrom'],
            through: {
                model: db.Course,
                attributes: [],
                where: {
                    facultyId
                }
            }
        });


const create = (forId, userFrom) =>
    db.ExchangeIntention
        .create({
            forId,
            userFrom
        });

const exchange = (intentionId, userTo) =>
    db.ExchangeIntention
        .findById(intentionId)
        .then(ex => db.Exchanged
            .create({
                userTo,
                userFrom: ex.userFrom,
                whatId: ex.whatId,
                forId: ex.forId
            }));

const remove = intentionId =>
    db.ExchangeIntention
        .destroy({
            where: {id: intentionId}
        });


module.exports={
    findAllIntentionsByFacultyId,
    create,
    exchange,
    remove
}