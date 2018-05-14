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
    collection.find({ 'name': req.params.name }, { fields: { tags: 1,_id:0 } }).then((result) => {
        if (result.length != 1) {
            res.send({ 'getusertags': '0', message: 'no user found in db' });
            return;
        }
        
        res.send({ 'getusertags': '1', tags: result[0].tags });
    }).catch((err) => {
        res.send({ 'getusertags': '0', message: 'db error' });
        console.log(err);
    });
});


//required req.body.newtags , array of string
router.post('/:name', isAuthentic, userNameVerify, function (req, res, next) {
    collection.update({ 'name': req.params.name }, { $addToSet: { tags: { $each: req.body.newtags } } }).
        then((result) => {
            if (result.n == 1) return res.send({ 'addusertags': '1' });
             res.send({ 'addusertags': '0', message: 'add tags failed' });
        }).catch((err) => {
            res.send({ 'addusertags': '0', message: 'db error' });
            console.log(err);
        });

});

//required req.body.deletetags , array of string
router.post('/delete/:name', isAuthentic, userNameVerify, function (req, res, next) {
    collection.update({ 'name': req.params.name }, { $pullAll: { tags: req.body.deletetags } }).
        then((result) => {
            if (result.n == 1) return res.send({ 'deleteusertags': '1' });
            res.send({ 'deleteusertags': '0', message: 'delete tags failed' });
        }).catch((err) => {
            res.send({ 'deleteusertags': '0', message: 'db error' });
            console.log(err);
        });
});

//add faculty require req.body.newfaculty array of string
router.post('/faculty/add/:name',isAuthentic,userNameVerify,function (req,res,next) {
    collection.update({ 'name': req.params.name }, { $addToSet: { 'tags.0': { $each: req.body.newfaculty } } }).
    then((result) => {
        if (result.n == 1) return res.send({ 'adduserfaculty': '1' });
    res.send({ 'adduserfaculty': '0', message: 'add faculty failed' });
}).catch((err) => {
    res.send({ 'adduserfaculty': '0', message: 'db error' });
    console.log(err);
});
});

//delete faculty require req.body.deletefaculty array of string
router.post('/faculty/delete/:name',isAuthentic,userNameVerify,function (req,res,next) {
    collection.update({ 'name': req.params.name }, { $pullAll: { 'tags.0': req.body.deletefaculty } }).
    then((result) => {
        if (result.n == 1) return res.send({ 'deleteuserfaculty': '1' });
    res.send({ 'deleteuserfaculty': '0', message: 'delete faculty failed' });
}).catch((err) => {
        res.send({ 'deleteuserfaculty': '0', message: 'db error' });
    console.log(err);
});
});

module.exports = router;
