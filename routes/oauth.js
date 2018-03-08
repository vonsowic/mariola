const router = require('express').Router();
const passport = require('../config/facebook-passport');


router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        console.log('Successful authentication, redirect home');
        res.redirect('/');
    });

module.exports = router;
