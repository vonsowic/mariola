const db = require('database');
const {NotFound} = require('utils/errors');


const findAllIntentionsByFacultyId = facultyId =>
    db.connection.query(
        buildSelectRequest(`c_what."facultyId"=${facultyId}`),
        { include: [{ model: db.Course }] })
        .then(res => res[0]);

const findOneIntentionById = (intentionId, facultyId) =>
    db.connection.query(
        buildSelectRequest(`ei.id=${intentionId} ${facultyId ? `AND c_what."facultyId"=${facultyId}` : ''}`),
        { include: [{ model: db.Course }] })
        .then(res => res[0][0] || (() => {throw new NotFound('Intention does not exist')})());

const buildSelectRequest = (where="'t'") => `
        SELECT  
            ei.id, 
            c_what.name AS "course",
            u_from.id as "userId", u_from.name AS "userName", u_from."lastName" AS "userLastName",
            c_what.id AS "whatId", c_what.group AS "whatGroup",
            c_for.id AS "forId", c_for.group AS "forGroup",
            ei."createdAt"
        FROM intentions ei 
        JOIN users u_from ON ei."userFrom"=u_from.id 
        JOIN courses c_what ON c_what.id=ei."whatId" 
        JOIN courses c_for ON c_for.id=ei."forId" 
        WHERE ${where}
        ORDER BY ei."createdAt" DESC;`;

const create = (forId, userFrom) =>
    db.Intention
        .create({
            forId,
            userFrom
        });

const exchange = (intentionId, userTo) =>
    db.Intention
        .findById(intentionId)
        .then(ex => db.Exchanged
            .create({
                userTo,
                userFrom: ex.userFrom,
                whatId: ex.whatId,
                forId: ex.forId
            }));

const remove = intentionId =>
    db.Intention
        .destroy({
            where: {id: intentionId}
        });


module.exports={
    findAllIntentionsByFacultyId,
    findOneIntentionById,
    create,
    exchange,
    remove
}