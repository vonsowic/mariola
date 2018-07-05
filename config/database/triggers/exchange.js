const {
    BadRequest,
} = require('utils/errors');

const ensureExchangeIsOk = () => exchange => {
    if(exchange.userFrom === exchange.userTo){
        throw new BadRequest("You can't exchange with yourself")
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

const removeIntentionAfterExchanged = (db, Op) => (exchanged) => {
    db.Intention.destroy({
        where: {
            [Op.or]: [{
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
    ensureExchangeIsOk,
    exchangeCourses,
    removeIntentionAfterExchanged,
};