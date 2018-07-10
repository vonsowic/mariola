const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;


class JWTStrategy extends Strategy {
    constructor(salt){
        super({
                jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
                secretOrKey: salt
            }, (jwtPayload, done) => {
                done(null, jwtPayload);
            }
        )
    }
}

module.exports = JWTStrategy;