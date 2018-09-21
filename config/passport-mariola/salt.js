const generateSalt = require('random-token');
const { readFileSync, writeFileSync } = require("fs")

let salt,
    refreshSalt;

try {
    salt=process.env.SALT || readFileSync("salt");
    refreshSalt=process.env.REFRESH_SALT || readFileSync("rsalt")
} catch (err) {
    salt=generateSalt(16);
    refreshSalt=generateSalt(64);
    writeFileSync('salt', salt);
    writeFileSync('rsalt', refreshSalt);
}

module.exports={
    salt,
    refreshSalt
};