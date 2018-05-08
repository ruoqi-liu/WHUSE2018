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
var postCollection = db.get('post');

router.get('/:name/:page', isAuthentic, userNameVerify, function (req, res, next) {//get all posts
    var page = req.params.page;
    var pageLimit = 3;
    if (!page) page = 1;
    var skipNum = (page - 1) * pageLimit;
    if (skipNum < 0) skipNum = 0;

    collection.find({ name: req.params.name }, { fields: { postid: 1 } }).then((doc) => {
        if (doc.length != 1)
            res.send({ 'getuserpost': '0', message: 'db.find result incorrect' });
        doc = doc[0];
        var postids = doc.postid;
        if (!postids)
            return [];
        else
            return postCollection.find({ '_id': { $in: postids } }, {limit:pageLimit,skip:skipNum /*fields: { title: 1 }*/ });
    }).then((posts) => {
        res.send({ 'getuserpost': '1', 'posts': posts });
    }
        ).catch(err => {
            res.send({ 'getuserpost': '0', message: 'db error' });
            console.log(err);
        });
    return;
});

//add postid has to be finished during the 'post post' procedure
//router.post('/:name', isAuthentic, userNameVerify, function (req, res, next) {//required postid in req.body
//    collection.update({ name: req.params.name }, { $push: { postid: req.body.postid } }).then((result) => {
//        if (result.length == 0) res.send({ 'addpostid': '0', message: 'unsuccessful add' });
//        else res.send({'addpostid':'1'});
//    }).catch(err => {
//        console.log(err);
//    });
//    return;
//});

//also the delete is done by the 'post delete' 
//router.delete('/:name',)

module.exports = router;