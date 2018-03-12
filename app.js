const environmentLoader = require('dotenv');
environmentLoader.config();

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/facebook-passport');

const users = require('./routes/users');
const oauth = require('./routes/oauth');

const User = require('./models/user');


const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '3cr3ts#tr',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.use('/api/users', users);
app.use('/api/oauth', oauth);
app.get('/api/hello', ensureAuthenticated, function(req, res, next) {
    res.send({express: 'Hello there'})
});


app.listen(5000);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401);
    res.send({express: "you need to authenticate"})
}

function serializeUser(user, done) {
    done(null, user.id)
}

function deserializeUser(userId, done){
    User.findOrCreate({where: { id: userId }}, {default: {}})
        .then(user => done(null, user))
}
