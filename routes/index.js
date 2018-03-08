const router = require('express').Router();

/* GET home page. */
router.get('/hello', function(req, res, next) {
  res.send({express: 'Hello there'})
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


module.exports = router;
