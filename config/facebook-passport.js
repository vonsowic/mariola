const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new FacebookStrategy({
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        callbackURL: "/api/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile)
    }
));


module.exports = passport;