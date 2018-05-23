const passport = require('passport');
const FacebookStrategy = require('passport-facebook-token');
const passportJWT = require('passport-jwt');
const getJwtSecret = require('./salt');
const db = require('database');
const userGetter = require('./user-db-getter');

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;


passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
    async (token, refreshToken, profile, done) => {
        let user = await userGetter(profile.id)

        if(!user) {
            await createUser(profile, token)
            user = await userGetter(profile.id);
        }

        done(null, user);
    }
));


passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: getJwtSecret()
    },
    (jwtPayload, done) => {
        done(null, jwtPayload);
    }
));


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