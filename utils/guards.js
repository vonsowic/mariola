const passport = require('passport-mariola');
const cache = require('@cache');

const blacklistedKey = user => `blacklisted:${user.id}`;

const unauthenticate = user => cache.set(
    blacklistedKey(user),
    encryptUser(user),
    'EX',
    (user.exp - user.iat) * 1000
);


const encryptUser = ({id, iat, exp}) => JSON.stringify({id, iat, exp});


const ensureFacultyMember = (idGetter=defaultIdGetter) => (req, res, next) => {
    const facultyInfo = req.user.faculties[idGetter(req)];
    if ( !facultyInfo ){
        res
            .status(403)
            .send({message: 'You are not member of faculty!'})
    } else if (facultyInfo.isBanned){
        res
            .status(403)
            .send({message: 'You are banned from this faculty!'})
    } else {
        next()
    }
};

const ensureAuthenticated = passport.authenticate('jwt', {session: false})

const ensureAuthenticatedByRefreshToken = passport.authenticate('refresh', {session: false})

const ensureIsAdmin = (idGetter=defaultIdGetter) => (req, res, next) => {
    try {
        if(req.user.faculties[idGetter(req)].isAdmin) {
            next()
        } else {
            throw new Error()
        }
    } catch(err) {
        res
            .status(403)
            .send({message: 'You are not an admin!'})
    }
};


const ensureNotLogout = (req, res, next) => {
    cache.getAsync(blacklistedKey(req.user))
        .then(blacklistedToken => {
            if(blacklistedToken === encryptUser(req.user)){
                res
                    .status(401)
                    .end()
            } else {
                next()
            }
        })
        .catch(() => next())
};


const defaultIdGetter = req => req.params.facultyId || req.query.facultyId;


module.exports={
    ensureAuthenticated,
    ensureFacultyMember,
    ensureIsAdmin,
    ensureNotLogout,
    unauthenticate,
    ensureAuthenticatedByRefreshToken
};