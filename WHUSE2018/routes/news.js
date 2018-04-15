var defaultSegment = require('../Segment/mySegment').defaultSegment;
var express = require('express');
var session = require('express-session');
var flash = require('connect-flash');
var router = express.Router();
var passport = require('./Passport/Passport').passport;
var isAuthentic = require('./Passport/Passport').authentic;
var userNameVerify = require('./Passport/Passport').userNameVerify;
var postOwnerVerify = require('./Passport/Passport').postOwnerVerify;
var logout = require('./Passport/Passport').logout;
var monk = require('monk');
var db = monk('localhost:27017/WHUSE');
var collection = db.get('user');
var newsCollection = db.get('news');

//required body.searchtext body.faculty:[]
router.post('/search', function (req, res, next) {
    var textParts = defaultSegment(req.body.searchText);
    newsCollection.find({ 'faculty': { $in: req.body.faculty }, 'tags': { $in: textParts } }, { fields: { tags: 0 }, sort: { date: -1 }, limit: 10 }).then(results => {
        res.send({ 'searchnews': '1', 'news': results });
        return;
    }).catch(err => {
        req.send({ 'searchnews': '0', message: 'db error.' });
        console.log(err);
        });
});

//required faculty:[]
router.post('/:name', isAuthentic, userNameVerify, function (req, res, next) {
    var name = req.params.name;
    collection.findOne({ 'name': name }).then(doc => {
        var tags = doc.tags;
        var faculty = req.body.faculty;
        if (!tags || tags.length == 0) return newsCollection.find({ 'faculty': { $in: faculty } }, { sort: { date: -1 }, limit: 10 });
        return newsCollection.find({ 'faculty': { $in: faculty }, 'tags': { $in: tags } }, { fields: { tags: 0 }, sort: { date: -1 }, limit: 10 });
    }).then(results => {
        res.send({ 'getNews': '1', 'news': results });
        return;
    }).catch(err => {
        res.send({ 'getNews': '0', message: 'db error' });
        console.log(err);
    });
});


module.exports = router;