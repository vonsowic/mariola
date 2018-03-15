const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./database').User;

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
        callbackURL: "/api/oauth/facebook/callback"
    },
    async (token, refreshToken, profile, done) => {
        let user = await User.findOne({
            where: { profileId : profile.id }
        });

        if(!user) {
            user = await createUser(profile, token)
                .save()
        }

        done(null, user);
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