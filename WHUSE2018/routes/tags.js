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
var tagsCollection = db.get('tags');

router.get('/:limitNum', function (req, res, next) {
    var limitNum = req.params.limitNum;
    tagsCollection.find({}, { sort: { times: -1 }, limit: limitNum, fields: { tag: 1 } }).then((result) => {
        res.send({ 'tags': result, 'gettags':'1'});//tags:array of {tag:,_id:} 
        return;
    }).catch((err) => {
        res.send({ 'gettags': '0', message: 'db error.' });
        console.log(err);
     });

});

module.exports = router;