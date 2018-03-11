const environmentLoader = require('dotenv');
environmentLoader.config();

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const index = require('./routes/index');
const users = require('./routes/users');
const oauth = require('./routes/oauth');
const redirections = require('./routes/redirections');


const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: '3cr3ts#tr',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', ensureAuthenticated, users);
app.use('/api/oauth', oauth);
app.use('/api', ensureAuthenticated, index);
app.use('/', redirections);

app.listen(5000);

function ensureAuthenticated(req, res, next) {
    console.warn("checnking if authnaticated")
    if (req.isAuthenticated()) {
        console.warn("is authnaticated")
        return next();
    }
    console.warn("is not authnaticated")
    res.status(403)
    res.send("you need to authenticate")
    // res.redirect('/login')
}