const router = require('express').Router();
const passport = require('../config/facebook-passport');


router.get('/facebook', passport.authenticate('facebook', {scope : ['public_profile', 'email'] }));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : 'http://localhost:3000/timetable',
        failureRedirect: 'http://localhost:3000/login'
    }));


module.exports = router;
