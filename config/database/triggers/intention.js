const Op = require('sequelize').Op;
const {
    NotFound,
    BadRequest,
    Conflict
} = require('utils/errors');

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
                },
                id: {
                    [Op.ne]: forCourse.id
                }
            },
            include: [{
                model: db.User,
                where: {
                    id: intention.userFrom
                }
            }]
        });


    if(!whatCourse){
        throw new BadRequest("Is it possible what you are trying to do?")
    }

    intention.whatId = whatCourse.id;

    if(await db.ExchangeIntention.findOne({
            where: {
                userFrom: intention.userFrom,
                whatId: intention.whatId,
                forId: intention.forId,
            }
    })) {
        throw new Conflict("Intention already exist")
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
            if(matchedIntention) {
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

const transferWithoutExchangeIfPossible = db => async intention => {
    Promise
        .all([
            isTransferWithoutExchangeEnabled(db, intention),
            isMembersNumberSmallerThanMaximum(db, intention)
        ])
        .then(conditions => {
            if(conditions.every(x=>x)) {
                transferStudent(db, intention)
            }
        })
};

const isTransferWithoutExchangeEnabled = ({Faculty}, {whatId}) => Faculty
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

const isMembersNumberSmallerThanMaximum = async (db, {forId}) => false

const transferStudent = ({Exchanged}, intention) => Exchanged
    .create(intention);


module.exports={
    ensureIntentionIsOk,
    exchangeIfMatched,
    transferWithoutExchangeIfPossible
};