const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const getJwtSecret = require('../utils/get-jwt-secret');


router.get('/facebook/token',
    passport.authenticate('facebook-token', {session: false}),
    (req, res) => {
        const token = jwt.sign(JSON.stringify(req.user), getJwtSecret());
        res.json({token});
    }
);


module.exports = router;
