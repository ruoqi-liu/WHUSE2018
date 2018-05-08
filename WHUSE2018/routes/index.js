var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var user = req.user;
    if(!user) user={username:'用户'};
    res.render('index', { title: 'Index' ,'username':user.username});
});

router.get('/index', function (req, res, next) {
    var user = req.user;
    if(!user) user={username:'用户'};
  res.render('index', { title: 'Index','username':user.username });
});

router.get('/user', function (req, res, next) {
    var user = req.user;
    if(!user) user={username:'用户'};
    res.render('user', { title: 'User' ,'username':user.username});
});

router.get('/lost', function (req, res, next) {
    var user = req.user;
    if(!user) user={username:'用户'};
    res.render('lost', { title: 'Lost and Found' ,'username':user.username});
});

router.get('/register/:source/:type', function (req, res, next) {
    var type = req.params.type;
    var sourceEjs = req.params.source;
    res.render('register', { title: 'Register and Login' ,type:type, source:sourceEjs});
});

module.exports = router;
