const passport = require('passport');
const FacebookStrategy = require('passport-facebook-token');
const passportJWT = require('passport-jwt');
const db = require('database');
const getJwtSecret = require('./salt');

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;


passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
    async (token, refreshToken, profile, done) => {
        let user = await db.User.findOne({
            where: { fbProfileId : profile.id },
            attributes: ['id', 'name', 'lastName', 'fbProfileId'],
            include: {
                model: db.Faculty,
                attributes: ['id'],
                through: {
                    model: db.UserFaculty,
                    attributes: ['isAdmin'],
                }
            }
        });

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