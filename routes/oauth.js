const router = require('express').Router();
const passport = require('../config/facebook-passport');


router.get('/facebook', passport.authenticate('facebook', {scope : ['public_profile', 'email'] }));

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect: '/login'
    }));


module.exports = router;
