const db = require('database');

const findAllIntentionsByFacultyId = facultyId =>
    db.connection.query(`
        SELECT  
            ei.id, 
            c_what.name AS "course",
            u_from.name AS "userName", u_from."lastName" AS "userLastName",
            c_what.id AS "whatId", c_what.group AS "whatGroup",
            c_for.id AS "forId", c_for.group AS "forGroup"
        FROM exchange_intentions ei 
        JOIN users u_from ON ei."userFrom"=u_from.id 
        JOIN courses c_what ON c_what.id=ei."whatId" 
        JOIN courses c_for ON c_for.id=ei."forId" 
        WHERE c_what."facultyId"=${facultyId};
`, { include: [{ model: db.Course }] })
        .then(res => res[0]);



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