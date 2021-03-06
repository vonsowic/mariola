const { Op } = require('sequelize')

const {
    BadRequest,
} = require('utils/errors');

const ensureExchangeIsOk = () => exchange => {
    if(exchange.fromId === exchange.toId){
        throw new BadRequest("You can't exchange with yourself")
    }
};

const exchangeCourses = db => exchange => Promise
    .all([
        db.UserCourse
            .update({
                courseId: exchange.forId
            }, {
                where: {
                    userId: exchange.fromId,
                    courseId: exchange.whatId
                }
            }),
        db.UserCourse
            .update({
                courseId: exchange.whatId
            }, {
                where: {
                    userId: exchange.toId,
                    courseId: exchange.forId
                }
            })
    ]);


const removeIntentionAfterExchanged = db => exchanged =>
    db.Intention
        .destroy({
            where: {
                fromId: exchanged.fromId,
                whatId: exchanged.whatId,
                forId: exchanged.forId
            }
        });

const createNotifications = db => exchange =>
    db.Notification
        .bulkCreate([{
            exchangeId: exchange.id,
            userId: exchange.fromId
        }, {
            exchangeId: exchange.id,
            userId: exchange.toId
        }].filter(({userId}) => userId));

module.exports={
    ensureExchangeIsOk,
    exchangeCourses,
    removeIntentionAfterExchanged,
    createNotifications
};