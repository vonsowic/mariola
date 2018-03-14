const environmentLoader = require('dotenv');
environmentLoader.config();

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./config/facebook-passport');
const flash = require('connect-flash');

const users = require('./routes/users');
const oauth = require('./routes/oauth');

const ensureAuthenticated = require('./utils/ensure-authenticated');

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
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/api/oauth', oauth);
app.use('/api/users', ensureAuthenticated, users);

app.get('/api/hello', ensureAuthenticated, function(req, res, next) {
    res.send({express: 'Hello there'})
});


app.listen(5000);


