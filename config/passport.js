const passport = require('passport');
const FacebookStrategy = require('passport-facebook-token');
const passportJWT = require('passport-jwt');
const getJwtSecret = require('../utils/get-jwt-secret');
const User = require('./database').User;

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;


passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
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


passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: getJwtSecret()
    },
    (jwtPayload, done) => {
        done(null, cleanJwtPayload(jwtPayload));
    }
));


function createUser(profile, token) {
    return User.build({
        name: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        profileId: profile.id,
        accessToken: token
    })
}


function cleanJwtPayload(jwtPayload) {
    return {
        id: jwtPayload.id,
        name: jwtPayload.name,
        email: jwtPayload.email,
        lastName: jwtPayload.lastName,
        profileId: jwtPayload.profileId,
    }
}


module.exports = passport;