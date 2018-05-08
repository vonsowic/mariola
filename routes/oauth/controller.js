const router = require('express').Router();
const passport = require('passport-mariola');
const jwt = require('passport-mariola/jwt');


router.get('/facebook/token',
    passport.authenticate('facebook-token', {session: false}),
    (req, res) => {
        res.cookie("access_token",jwt(req.user),{path:"/",httpOnly: false}).send();

    }
);


module.exports = router;