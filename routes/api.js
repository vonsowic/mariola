const router = require('express').Router();
const oauth = require('./oauth');
const users = require('./users');
const plan = require('./plan');
const faculty = require('./faculty');
const ensureAuthenticated = require('utils/ensure-authenticated');

router.use('/oauth', oauth);
router.use('/users', ensureAuthenticated, users);
router.use('/faculties', ensureAuthenticated, faculty);
router.use('/plan', ensureAuthenticated, plan);

module.exports=router;