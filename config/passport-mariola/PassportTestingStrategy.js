const CustomStrategy = require('passport-custom')
const userGetter = require('./user-db-getter');


const getTester = () => userGetter(process.env.RUN_AS)
    .then(t => Object.assign(t, {iat: Date.now(), exp: Date.now() + 1000}))

class PassportTestingStrategy extends CustomStrategy {
    constructor(){
        super(function(req, callback) {
            getTester()
                .then(t => callback(null, t));
        })
    }
}


module.exports = PassportTestingStrategy;