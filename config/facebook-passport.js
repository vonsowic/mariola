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
        callbackURL: "http://localhost:5000/api/oauth/facebook/callback"
    },
    (token, refreshToken, profile, done) => {
        User.findOne({
            where: { profileId : profile.id }
        })
            .then(user => {
                if(!user){
                    console.log('Profile', profile)
                    User.build({
                        name: profile.displayName,
                        email: profile.email,
                        profileId: profile.id,
                        accessToken: token
                    })
                        .save()
                        .then(savedUser => done(null, savedUser))
                } else {
                    done(null, user);
                }
            })

    }
));


module.exports = passport;