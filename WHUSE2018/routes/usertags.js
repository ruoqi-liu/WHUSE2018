var express = require('express');
var session = require('express-session');
var flash = require('connect-flash');
var router = express.Router();
var passport = require('./Passport/Passport').passport;
var isAuthentic = require('./Passport/Passport').authentic;
var logout = require('./Passport/Passport').logout;
var userNameVerify = require('./Passport/Passport').userNameVerify;
var monk = require('monk');
var db = monk('localhost:27017/WHUSE');
var collection = db.get('user');

router.get('/:name', isAuthentic, userNameVerify, function (req, res, next) {
    collection.findOne({ 'name': req.params.name }, { fields: { tags: 1 } }).then((result) => {
        if (!result)
            return res.send({ 'getusertags': '0', message: 'no user found in db' });
        return res.send({ 'getusertags': '1', tags: result });
    }).catch((err) => { console.log(err)});
});


//required req.body.newtags , array of string
router.post('/:name', isAuthentic, userNameVerify, function (req, res, next) {
    collection.update({ 'name': req.params.name }, { $push: { tags: { $each: req.body.newtags } } }).
        then((result) => {
            if (result.length == 1) return res.send({ 'addtags': '1' });
            return res.send({ 'addtags': '0', message: 'add tags failed' });
        }).catch((err) => { console.log(err) });

});

//required req.body.deletetags , array of string
router.delete('/:name', isAuthentic, userNameVerify, function (req, res, next) {
    collection.update({ 'name': req.params.name }, { $pullAll: { tags: req.body.deletetags } }).
        then((result) => {
            if (result.length == 1) return res.send({ 'deletetags': '1' });
            return res.send({ 'deletetags': '0', message: 'delete tags failed' });
        }).catch((err) => { console.log(err) });
});

module.exports = router;