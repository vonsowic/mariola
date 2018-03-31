const passport = require('passport-mariola');

module.exports = passport.authenticate('jwt', {session: false});