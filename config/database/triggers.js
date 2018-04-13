const err = require('utils/errors');


const ensureIntentionIsOk = db => async (intention) => {
    if(intention.whatId === intention.forId){
        throw new err.BadRequest("You are member of that course - choose another")
    }

    const whatCourse = await db.Course
        .findById(intention.whatId);

    const forCourse = await db.Course
        .findById(intention.forId);

    if(!whatCourse || !forCourse){
        throw new err.NotFound('Course does not exist')
    }

    if(whatCourse.name !== forCourse.name){
        throw new err.BadRequest(`You can't exchange ${whatCourse.name} with ${forCourse.name}`)
    }

    if(whatCourse.group === '0' || forCourse.group === '0'){
        throw new err.BadRequest("You can't exchange lecture")
    }

    if(whatCourse.facultyId !== forCourse.facultyId){
        throw new err.BadRequest("You can't exchange between different faculties")
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