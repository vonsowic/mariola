const passport = require('passport');
const FacebookStrategy = require('passport-facebook-token');
const db = require('database');
const userGetter = require('./user-db-getter');
const isTestMode = require('utils/is-test-mode');

const Strategy = isTestMode()
    ? require('./PassportTestingStrategy')
    : require('./JWTStrategy');

passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
    async (token, refreshToken, profile, done) => {
        let user = await userGetter(profile.id);

        if(!user) {
            user = await createUser(profile, token);
        }

        done(null, user);
    }
));

passport.use('jwt', new Strategy());


function createUser(profile, token) {
    return db.User.create({
        name: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        fbProfileId: profile.id,
        accessToken: token
    })
}

module.exports = passport;