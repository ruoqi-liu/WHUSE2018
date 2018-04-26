var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var user = req.user;
    if(!user) user={username:'用户'};
    res.render('index', { title: 'Express' ,'username':user.username});
});

router.get('/index', function (req, res, next) {
    var user = req.user;
    if(!user) user={username:'用户'};
  res.render('index', { title: 'Express','username':user.username });
});

router.get('/lost/:type/:page', function (req, res, next) {
    var type = req.params.type;
    var page = req.params.page;
    var user = req.user;
    if(!user) user={username:'用户'};
    res.render('lost', { title: 'Lost and Found' ,type:type, page:page, 'username':user.username});
});

router.get('/register/:source/:type', function (req, res, next) {
    var type = req.params.type;
    var sourceEjs = req.params.source;
    res.render('register', { title: 'Register and Login' ,type:type, source:sourceEjs});
});

module.exports = router;
