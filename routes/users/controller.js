const router = require('express').Router();

router.get('/me', (req, res) => {
    res.send(req.user)
});

module.exports = router;
