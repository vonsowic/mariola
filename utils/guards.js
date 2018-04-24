const passport = require('passport-mariola');

const authenticated = new Map;

const notifyNewAuthentication = user => {
    clearTimeout(authenticated.get(user.id));

    authenticated.set(
        user.id,
        setTimeout(() => authenticated.remove(user.id), Number(process.env.EXPIRATION_TIME_AS_SECONDS) * 1000)
    );

};

const unauthenticate = user => {
    clearTimeout(authenticated.get(user.id));
    authenticated.delete(user.id)
};

const ensureAuthenticated = passport.authenticate('jwt', {session: false});

const ensureFacultyMember = (idGetter=defaultIdGetter) => (req, res, next) => {
    if(idGetter(req) in req.user.faculties){
        next()
    } else {
        res.send(403, {message: 'You are not member of faculty!'})
    }
};

const ensureIsAdmin = (idGetter=defaultIdGetter) => (req, res, next) => {
    if(req.user.faculties[idGetter(req)]){
        next()
    } else {
        res.send(403, {message: 'You are the root!'})
    }
};

const ensureNotLogout = (req, res, next) => {
    if( authenticated.has(req.user.id) ){
        next()
    } else {
        res
            .status(401)
            .end()
    }
};

const defaultIdGetter = req => req.params.facultyId || req.body.facultyId;

module.exports={
    ensureAuthenticated,
    ensureFacultyMember,
    ensureIsAdmin,
    ensureNotLogout,
    notifyNewAuthentication,
    unauthenticate
};