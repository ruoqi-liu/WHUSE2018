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
router.post('/search/:page', function (req, res, next) {
    var eachPageNum = 10;
    var page = req.params.page;
    var limitNum = page*eachPageNum;
    var skipNum = (page - 1) * eachPageNum;
    if (skipNum < 0) skipNum = 0;
    var textParts = defaultSegment(req.body.searchText);
    newsCollection.find({ 'faculty': { $in: req.body.faculty }, 'tags': { $in: textParts } }, { fields: { tags: 0 }, sort: { date: -1 }, limit: limitNum ,skip:skipNum}).then(results => {
        res.send({ 'searchnews': '1', 'news': results });
        return;
    }).catch(err => {
        req.send({ 'searchnews': '0', message: 'db error.' });
        console.log(err);
        });
});

router.post('/:name/:page', isAuthentic, userNameVerify, function (req, res, next) {
    var eachPageNum = 10;
    var page = req.params.page;
    var limitNum = page*eachPageNum;
    var skipNum = (page - 1) * eachPageNum;
    if (skipNum < 0) skipNum = 0;
    var name = req.params.name;
    collection.findOne({ 'name': name }).then(doc => {
        var tags = doc.tags;
        var faculty = tags[0];
        var query = {'tags': { '$in': tags },'faculty':{ '$in': faculty } };
        if(!faculty||faculty.length==0) delete query['faculty'];
        if (!tags || tags.length == 1) delete query['tags'];
        return newsCollection.find(query, { fields: { tags: 0 }, sort: { date: -1 }, limit: limitNum ,skip:skipNum});
    }).then(results => {
        res.send({ 'getNews': '1', 'news': results });
        return;
    }).catch(err => {
        res.send({ 'getNews': '0', message: 'db error' });
        console.log(err);
    });
});

router.get('/:page',function (req,res,next) {
    var eachPageNum = 10;
    var page = req.params.page;
    var limitNum = page*eachPageNum;
    var skipNum = (page - 1) * eachPageNum;
    if (skipNum < 0) skipNum = 0;
    newsCollection.find({},{sort:{date:-1},limit:limitNum,skip:skipNum}).then(results=>{
        res.send({'getNews':'1','news': results});
        return;
    }).catch(err=>{
        console.log(err);
        res.send({'getNews':'0',message:'db error'});
    });
})

module.exports = router;
