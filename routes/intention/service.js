const db = require('database');

const findAllIntentionsByFacultyId = facultyId =>
    db.Course
        .findAll({
            where: {facultyId},
            attributes: ['id']
        })
        .map(c => c.id)
        .then(ids =>
            db.ExchangeIntention
                .findAll({
                    attributes: ['id', 'whatId', 'forId', 'userFrom'],
                    where: {
                        whatId: {
                            [db.Op.in]: ids
                        }
                    }
                }));



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