const db = require('database');
const err = require('utils/errors');


const ensureIntentionIsOk = (intention) => {
    if(intention.fromId === intention.toId){
        throw new err.BadRequest("You can't exchange with yourself")
    }

    if(intention.whatId === intention.forId){
        throw new err.BadRequest("You are member of that course - choose another")
    }
};

const exchangedIfMatched = (intention) => {
    db.ExchangeIntention
        .findAll({
            where: {
                whatId: intention.forId,
                forId: intention.whatId,
            },
            order: ['createdAt', 'ASC'],
            limit: 1
        })
        .then(matchedIntentions => {
            if(matchedIntentions.length > 0){
                let i = matchedIntentions[0];
                db.Exchanged
                    .create({
                        whatId: i.whatId,
                        forId: i.forId,
                        userFrom: i.userFrom,
                        userTo: intention.userFrom
                    })
            }
        })
};

const notifyAboutExchanged = (exchanged) => {
    db.query(`NOTIFY new-exchanged, ${JSON.stringify(exchanged)};`)
};

const removeIntentionAfterExchanged = (exchanged) => {
    db.ExchangeIntention.destroy({
        where: {
            userFrom: exchanged.userFrom,
            whatId: exchanged.whatId,
            forId: exchanged.forId,
        }
    })
};

module.exports={
    ensureIntentionIsOk,
    exchangedIfMatched,
    notifyAboutExchanged,
    removeIntentionAfterExchanged
};