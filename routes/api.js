const router = require('express').Router();
const oauth = require('./oauth');
const users = require('./users');
const ensureAuthenticated = require('../utils/ensure-authenticated');

router.use('/oauth', oauth);
router.use('/users', ensureAuthenticated, users);

// TODO: remove on cleanup
router.get('/hello', ensureAuthenticated, (req, res) => {
    res.send({express: 'Hello there'})
});

module.exports=router;