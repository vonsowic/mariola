const router = require('express').Router();
const passport = require('passport-mariola');
const {
    createToken,
    createRefreshToken } = require('passport-mariola/jwt');
const { ensureAuthenticatedByRefreshToken } = require('utils/guards');
const { findUser } = require('passport-mariola/user-db-getter');
const { Unauthorized } = require('utils/errors');


router.get('/facebook/token', passport.authenticate('facebook-token', {session: false}), (req, res, next) => {
    res
        .send({
            token: createToken(req.user),
            refreshToken: createRefreshToken({
                id: req.user.id,
                fbProfileId: req.user.fbProfileId
            })
        })
        .catch(err => next(err))
});

router.get('/token/refresh', ensureAuthenticatedByRefreshToken, (req, res, next) => {
    findUser(req.user.fbProfileId)
        .then(user => {
            if ( !user ){
                throw new Unauthorized()
            }

            return user
        })
        .then(user => res.send({
            token: createToken(user)
        }))
        .catch(err => next(err))
});

module.exports = router;