const generateSalt = require('random-token');

module.exports={
    salt: generateSalt(16),
    refreshSalt: generateSalt(64)
};