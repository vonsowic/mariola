const generateSalt = require('random-token');
const cache = require('@cache');

let salt, refreshSalt;

cache.getAsync('salt:token')
    .then(res => {
        salt = res;
        return cache.getAsync('salt:refreshToken')
            .then(res => {
                refreshSalt = res;
            })
    })
    .catch(() => {
        salt = generateSalt(16);
        cache.set('salt:token', salt);

        refreshSalt = generateSalt(64);
        cache.set('salt:refreshToken', refreshSalt);
    })
    .finally(() => {
        module.exports={
            salt,
            refreshSalt
        };
    });



