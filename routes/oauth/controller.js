const router = require('express').Router();
const passport = require('passport-mariola');
const jwt = require('passport-mariola/jwt');
const notifyNewAuthentication = require('utils/guards').notifyNewAuthentication;

router.get('/facebook/token',
    passport.authenticate('facebook-token', {session: false}),
    (req, res) => {
        notifyNewAuthentication(req.user);
        res.json({token: jwt(req.user)});
    }
);


module.exports = router;