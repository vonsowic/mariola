const router = require('express').Router();
const passport = require('passport-mariola');
const jwt = require('passport-mariola/jwt');
const jsonwebtoken = require('jsonwebtoken');
const notifyNewAuthentication = require('utils/guards').notifyNewAuthentication;
const ensureAuthenticated = require('utils/guards').ensureAuthenticated;
const userGetter = require('passport-mariola/user-db-getter');

router.get('/facebook/token',
    passport.authenticate('facebook-token', {session: false}),
    (req, res) => {
        notifyNewAuthentication(req.user);
        res.send({
            token: jwt(req.user),
            refreshToken: jsonwebtoken.sign({
                id: req.user.id,
                fbProfileId: req.user.fbProfileId
            }, process.env.JWT_SECRET, {})
        });
    }
);

router.get('/token/refresh',
    ensureAuthenticated,
    async (req, res) => {
        const user = await userGetter(req.user.fbProfileId);

        if(user){
            notifyNewAuthentication(user);
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