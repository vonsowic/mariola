const router = require('express').Router();
const passport = require('passport-mariola');
const jwt = require('passport-mariola/jwt');
const salt = require('passport-mariola/salt');
const jsonwebtoken = require('jsonwebtoken');
const ensureAuthenticated = require('utils/guards').ensureAuthenticated;
const userGetter = require('passport-mariola/user-db-getter');

router.get('/facebook/token',
    passport.authenticate('facebook-token', {session: false}),
    (req, res) => {
        res.send({
            token: jwt(req.user),
            refreshToken: jsonwebtoken.sign({
                id: req.user.id,
                fbProfileId: req.user.fbProfileId
            }, salt(), {})
        });
    }
);

router.get('/token/refresh',
    ensureAuthenticated,
    async (req, res) => {
        const user = await userGetter(req.user.fbProfileId);

        if(user){
            res.send({
                token: jwt(user)
            })
        } else {
            res
                .status(401)
                .send()
        }
});

module.exports = router;