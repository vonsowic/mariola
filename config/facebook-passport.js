const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then(user => done(null, user))
});

passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/oauth/facebook/callback"
    },
    (token, refreshToken, profile, done) => {
        User.findOne({
            where: { profileId : profile.id }
        })
            .then(user => {
                if(!user){
                    createUser(profile, token)
                        .save()
                        .then(savedUser => done(null, savedUser))
                } else {
                    done(null, user);
                }
            })
    }
));

function createUser(profile, token) {
    return User.build({
        name: profile.displayName,
        email: profile.email,
        profileId: profile.id,
        accessToken: token
    })
}


module.exports = passport;