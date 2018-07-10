const { NotFound } = require('utils/errors');
const router = require('express').Router();
const db = require('database');

router.get('/', (req, res, next) => {
    db.Notification
        .findAll(({
            attributes: ['exchangeId'],
            where: {
                userId: req.user.id,
                wasRead: req.query.wasRead === 'true'
            }
        }))
        .then(notifications => res.send(notifications))
        .catch(err => next(err))
});

router.patch('/', (req, res, next) => {
    db.Notification
        .findOne({
            where: {
                exchangeId: req.query.exchangeId,
                userId: req.user.id
            }
        })
        .then(n => {
            if (!n) {
                throw new NotFound()
            }

            return n
        })
        .then(n => n.update({ wasRead: true }))
        .then(() => res
            .status(204)
            .end())
        .catch(err => next(err))
});

module.exports=router;