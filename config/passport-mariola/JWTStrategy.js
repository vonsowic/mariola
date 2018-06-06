const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const getJwtSecret = require('./salt');

class JWTStrategy extends Strategy {
    constructor(){
        super({
                jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
                secretOrKey: getJwtSecret()
            }, (jwtPayload, done) => {
                done(null, jwtPayload);
            }
        )
    }
}

module.exports = JWTStrategy;