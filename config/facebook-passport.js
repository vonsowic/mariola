const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;


passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "/api/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile);
        done(null, profile)
    }
));


module.exports = passport;