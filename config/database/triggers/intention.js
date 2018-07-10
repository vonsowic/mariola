const { Promise, Op } = require('sequelize');
const {
    NotFound,
    NotAllowed,
    BadRequest,
    Conflict,
    Locked,
    NoContent
} = require('utils/errors');


const ensureExchangesEnabled = db => async intention => {
    if ( !(await areExchangesEnabled(db, intention))) {
        throw new Locked()
    }
};

const areExchangesEnabled = (db, intention) => db.Faculty
    .findOne({
        attributes: ['exchangesEnabled'],
        where: db
            .connection
            .literal(`id IN (SELECT "facultyId" FROM courses WHERE id=${intention.forId})`)
    })
    .then(res => {
        if ( !res ) {
            throw new NotFound()
        }

        return res.exchangesEnabled
    });


const ensureUserAllowedToCreateIntention = db => intention =>
    db.Faculty
        .findOne({
            attributes: [],
            include: [{
                model: db.User,
                where: {
                    id: intention.fromId
                },
                through: {
                    attributes: [],
                    where: {
                        isBanned: false
                    }
                }
            }, {
                model: db.Course,
                where: {
                    id: intention.forId
                }
            }]
        })
        .then(isAllowed => {
            if(!isAllowed) {
                throw new NotAllowed()
            }
        });




const ensureIntentionIsOk = db => async intention => {
    const forCourse = await db.Course
        .findById(intention.forId);

    if(!forCourse){
        throw new NotFound()
    }

    if(forCourse.group === '0'){
        throw new BadRequest("You can go on lectures whenever you want ;)")
    }

    const whatCourse = await db.Course
        .findOne({
            required: true,
            where: {
                name: forCourse.name,
                facultyId: forCourse.facultyId,
                group: {
                    [Op.ne]: '0'
                }
            },
            include: [{
                model: db.User,
                where: {
                    id: intention.fromId
                }
            }]
        });


    if(!whatCourse){
        throw new BadRequest("Is it possible what you are trying to do?")
    }

    if(whatCourse.id === intention.forId){
        throw new BadRequest("You are already member of this group")
    }

    intention.whatId = whatCourse.id;

    if(await db.Intention.findOne({
            where: {
                fromId: intention.fromId,
                whatId: intention.whatId,
            }
    })) {
        throw new Conflict(`You have already declared your willingness to attend to group ${whatCourse.group} of ${whatCourse.name}`)
    }
};

const exchangeIfMatched = db => intention => db.Intention
    .findOne({
        where: {
            whatId: intention.forId,
            forId: intention.whatId,
        },
        order: ['createdAt'],
    })
    .then(matchedIntention => {
        if(matchedIntention) {
            return db.Exchanged
                .create({
                    whatId: matchedIntention.whatId,
                    forId: matchedIntention.forId,
                    fromId: matchedIntention.fromId,
                    toId: intention.fromId
                })
                .then(() => {
                    throw new NoContent()
                })
        }
    });


const transferWithoutExchangeIfPossible = db => async intention =>
    Promise
        .all([
            isTransferWithoutExchangeEnabled(db, intention),
            isMembersNumberSmallerThanMaximum(db, intention.forId)
        ])
        .then(conditions => {
            if(conditions.every(x=>x)) {
                return transferStudent(db, intention)
                    .then(() => {
                        throw new NoContent('Exchanged')
                    })
            }
        });


const isTransferWithoutExchangeEnabled = (db, {whatId}) => db.Faculty
    .findOne({
        attributes: ['transferWithoutExchangeEnabled'],
        include: [{
            model: db.Course,
            attributes: ['id'],
            where: {
                id: whatId
            },
            required: true
        }]
    })
    .then(res => res.transferWithoutExchangeEnabled);

const isMembersNumberSmallerThanMaximum = (db, courseId) => db.connection
    .query(`SELECT (SELECT COUNT(*) FROM user_courses WHERE "courseId"=${courseId}) 
                 < (SELECT "maxStudentsNumber" FROM courses WHERE id=${courseId}) 
                 AS result LIMIT 1;`)
    .then(r => r[0][0].result);

const transferStudent = ({Exchanged}, intention) => Exchanged
    .create({
        fromId: intention.fromId,
        toId: null,
        whatId: intention.whatId,
        forId: intention.forId,
    });



module.exports={
    ensureIntentionIsOk,
    exchangeIfMatched,
    transferWithoutExchangeIfPossible,
    ensureExchangesEnabled,
    ensureUserAllowedToCreateIntention,

    isMembersNumberSmallerThanMaximum,
    transferStudent
};