const router = require('express').Router();
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const getJwtSecret = require('../utils/get-jwt-secret');


router.get('/facebook/token',
    passport.authenticate('facebook-token', {session: false}),
    (req, res) => {
        let token = cleanJwtPayload(req.user);
        token = jwt.sign(JSON.stringify(token), getJwtSecret());
        res.json({token});
    }
);

function cleanJwtPayload(jwtPayload) {
    return {
        id: jwtPayload.id,
        name: jwtPayload.name,
        email: jwtPayload.email,
        lastName: jwtPayload.lastName,
        fbProfileId: jwtPayload.fbProfileId,
    }
}


module.exports = router;
