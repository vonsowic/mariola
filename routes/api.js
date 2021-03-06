const router = require('express').Router();
const oauth = require('./oauth');
const plan = require('./course');
const faculty = require('./faculty');
const intention = require('./intention');
const exchange = require('./exchange');
const notification = require('./notification');

const {
    ensureAuthenticated,
    ensureNotLogout} = require('utils/guards');

router.use('/oauth', oauth);

router.use(ensureAuthenticated, ensureNotLogout);

router.use('/faculties', faculty);
router.use('/plan', plan);
router.use('/intentions', intention);
router.use('/exchanges', exchange);
router.use('/notifications', notification);



module.exports=router;