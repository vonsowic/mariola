const router = require('express').Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/me', (req, res) => {
    res.send({user: req.user})
});

module.exports = router;
