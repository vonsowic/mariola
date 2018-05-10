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
            user = await createUser(profile, token)
        }

        let faculties = user
            .faculties
            .reduce((acc, it) =>
                Object.assign(
                    acc, {
                        [it['id']]: it['user_faculty']['isAdmin']
                    }),
                {});


        done(null, {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            fbProfileId: user.fbProfileId,
            faculties
        });
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