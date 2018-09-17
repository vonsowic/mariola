const generateSalt = require('random-token');
const { readFileSync, writeFileSync } = require("fs")

let salt,
    refreshSalt;

try {
    salt=readFileSync("salt");
    refreshSalt=readFileSync("rsalt")
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