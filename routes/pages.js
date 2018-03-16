const router = require('express').Router();
const ensureAuthenticated = require('../utils/ensure-authenticated');

router.get('/', (req, res) => {
    res.render('index', { title: 'Mariola' })
});

router.get('/login', (req, res) => {
    res.render('login')
});

// TODO: remove
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render('profile', { user: JSON.stringify(req.user)})
});

module.exports=router;