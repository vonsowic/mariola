const router = require('express').Router();
const reactRouter = require('react-router');

router.get('/login', (req, res) => {
    res.send({express: "hello world"})
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;