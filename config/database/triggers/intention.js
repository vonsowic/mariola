const err = require('utils/errors');
const Op = require('sequelize').Op;

const ensureIntentionIsOk = db => async intention => {
    const forCourse = await db.Course
        .findById(intention.forId);

    const whatCourse = await db.Course
        .findOne({
            where: {
                name: 'Hurtownie danych',
                facultyId: 6,//forCourse.facultyId,
                group: {
                    [Op.ne]: 0
                },
                id: {
                    [Op.ne]: 277//forCourse.id
                }
            },
            through: {
                model: db.UserCourse,
                where: {
                    userId: intention.userFrom
                }
            }
        });


    if(!whatCourse || !forCourse){
        throw new err.BadRequest('Course does not exist')
    }

    if(await db.ExchangeIntention.findOne({
            where: {
                userFrom: intention.userFrom,
                whatId: intention.whatId,
                forId: intention.forId,
            }
    })) {
        throw new err.Conflict("Intention already exist")
    }
};

const exchangeIfMatched = db => intention => {
    db.ExchangeIntention
        .findOne({
            where: {
                whatId: intention.forId,
                forId: intention.whatId,
            },
            order: ['createdAt'],
        })
        .then(matchedIntention => {
            if(matchedIntention){
                db.Exchanged
                    .create({
                        whatId: matchedIntention.whatId,
                        forId: matchedIntention.forId,
                        userFrom: matchedIntention.userFrom,
                        userTo: intention.userFrom
                    })
            }
        })
};

const ensureExchangeIsOk = () => exchange => {
    if(exchange.userFrom === exchange.userTo){
        throw new err.BadRequest("You can't exchange with yourself")
    }
};

const exchangeCourses = db => exchange => {
    db.UserCourse.update({
        userId: exchange.userTo
    }, {
        where: {
            userId: exchange.userFrom,
            courseId: exchange.whatId
        }
    });

    db.UserCourse.update({
        userId: exchange.userFrom
    }, {
        where: {
            userId: exchange.userTo,
            courseId: exchange.forId
        }
    })
};

const removeIntentionAfterExchanged = (db, op) => (exchanged) => {
    db.ExchangeIntention.destroy({
        where: {
            [op.or]: [{
                userFrom: exchanged.userFrom,
                whatId: exchanged.whatId,
                forId: exchanged.forId
            }, {
                userFrom: exchanged.userTo,
                whatId: exchanged.forId,
                forId: exchanged.whatId,
            }]
        }
    })
};

module.exports={
    ensureIntentionIsOk,
    exchangeIfMatched,
    ensureExchangeIsOk,
    exchangeCourses,
    removeIntentionAfterExchanged
};