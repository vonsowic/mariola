const router = require('express').Router();
const oauth = require('./oauth');
const users = require('./users');
const plan = require('./course');
const faculty = require('./faculty');
const intention = require('./intention');
const {ensureAuthenticated, ensureNotLogout} = require('utils/guards');

router.use('/oauth', oauth);

router.use(ensureAuthenticated,ensureNotLogout);
router.use('/users', users);

router.use('/faculties', faculty);
router.use('/plan', plan);
router.use('/intentions', intention);



module.exports=router;