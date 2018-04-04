var express = require('express');
var session = require('express-session');
var flash = require('connect-flash');
var router = express.Router();
var passport = require('./Passport/Passport').passport;
var isAuthentic = require('./Passport/Passport').authentic;
var logout = require('./Passport/Passport').logout;
var monk = require('monk');
var db = monk('localhost:27017/WHUSE');
var collection = db.get('user');


router.get('/:name', isAuthentic,function (req, res, next) {
    var name = req.params.name;
    var user = req.session.passport.user;
    console.log(req.session);
    if (name != user.name) return res.send({ 'isuserinfo': '0', 'message': 'incorrespond name' });

    collection.find({ 'name': name }, { fields: { name: 1, userinfo: 1 } }, function (err, result) {
        if (err) throw err;

        if (result.length == 1) {
            result = result[0];
            return res.send({ 'isuserinfo': '1', userinfo: result.userinfo });
        }
        else
            return res.send({ 'isuserinfo': '0','message':'db error'});
    });
});

router.put('/:name', isAuthentic, function (req, res, next) {
    var name = req.params.name;
    var user = req.session.passport.user;
    if (name != user.name) return res.send({ 'updateuserinfo': '0', 'message': 'incorrespond name' });
    if (!req.body.content) return res.send({ 'updateuserinfo': '0', 'message': 'content null' });
    var content = req.body.content;
    if (!content.photo) content.photo = '/images/0001.jpg';
    collection.update({ 'name': name }, {
        $set: {userinfo:content} } , function (err, result) {
        if (err) throw err;

        if (result.length == 1) {
            result = result[0];
            return res.send({ 'updateuserinfo': '1', userinfo: result.userinfo });
        }
        else
            return res.send({ 'updateuserinfo': '0', 'message': 'db error' });
    });
});

module.exports = router;