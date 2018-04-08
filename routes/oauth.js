const router = require('express').Router();
const passport = require('passport-mariola');
const jwt = require('passport-mariola/jwt');


router.get('/facebook/token',
    passport.authenticate('facebook-token', {session: false}),
    (req, res) => {
        res.json({token: jwt(req.user)});
    }
);


module.exports = router;
