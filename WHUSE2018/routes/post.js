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
var postCollection = db.get('post');

router.post('/add', isAuthentic, function (req, res, next) {//newpost: title,content,type,postinfo{username,phone,бнбн}
    var newPost = req.body.newpost;
    if (!newPost) return res.send({ 'addpost': '0', 'message': 'missing important paramerters' });
    var type = newPost.type;
    var content = newPost.content;
    var postInfo = newPost.postinfo;
    var title = newPost.title;
    if (!postInfo || !type || !content || !postInfo) return res.send({ 'addpost': '0', 'message': 'missing important paramerters' });
    if (!newPost.title) {
        newPost.title = newPost.type;
        title = newPost.type;
    }
    postInfo['username'] = req.session.passport.user.username;

    var titleIndex = defaultSegment(title);
    var contentIndex = defaultSegment(content);
    newPost['titleIndex'] = titleIndex;
    newPost['contentIndex'] = contentIndex;
    postCollection.insert(newPost).then((r) => {
        if (!r) return res.send({ 'addpost': '0', message: 'failed to insertOne,try again.' });
        var postID = r._id;
        var username = r.postinfo.username;
        return collection.update({ 'name': username }, { $push: { postid: postID } });
    }).then((r) => {
        if (!r.ok)//buzhichi shiwu shi zhen de kongbu,buzhidao zenme zuo rollback            
            res.send({ 'addpost': '0', message: 'failed to add post id for user,manually add from db please.' });//na wo jiu bu zuo rollback le ba ,naoketong
        else {
            res.send({ 'addpost': '1' });
            postCollection.createIndex({titleIndex:1});
            postCollection.createIndex({contentIndex:1});
        }
        return;
    }).catch((err) => {
        res.send({ 'addpost': '0', message: 'db error' });
        console.log(err);
    });
    return;
});

router.get('/:type/:page', function (req, res, next) {
    var type = req.params.type;
    var pageLimit = 6;
    var skipNum = (req.params.page - 1) * pageLimit;
    if (skipNum < 0) skipNum = 0;
    postCollection.find({ 'type': type }, { sort: { _id: -1 }, limit: pageLimit, skip: skipNum }, function (err, result) {
        if (err) return next(err);
        return res.send({ 'getpost': '1', 'result': result });
    });

});

//updatepost {titile,type,content,postinfo:{}}
router.put('/:postid', isAuthentic, postOwnerVerify, function (req, res, next) {
    var updatePost = req.body.updatepost;
    if (!updatePost) return res.send({ 'updatepost': '0', message: 'missing important parameters' });
    var type = updatePost.type;
    var title = updatePost.title;
    var content = updatePost.content;
    var postInfo = updatePost.postinfo;
    if (!postInfo || !type || !content || !postInfo) return res.send({ 'updatepost': '0', 'message': 'missing important paramerters' });
    if (!title)
        title = updatePost.type;
    postInfo['username'] = req.session.passport.user.username;
    var titleIndex = defaultSegment(title);
    var contentIndex = defaultSegment(content);

    postCollection.update({ _id: req.params.postid }, {
        $set: {
            'title': title, 'type': type, 'content': content,
            'postinfo': postInfo, 'titleIndex': titleIndex, 'contentIndex': contentIndex
        }
    })
        .then((result) => {
            if (result.n == 1) return res.send({ 'updatepost': '1' });
            res.send({ 'updatepost': '0', message: 'update post failed' });
            return;
        }).catch((err) => {
            res.send({ 'updatepost': '0', message: 'db error' });
            console.log(err);
        });
    return;
});


router.delete('/:postid', isAuthentic, postOwnerVerify, function (req, res, next) {
    postCollection.remove({ _id: req.params.postid }).then((result) => {
        var username = req.session.passport.user.username;
        return collection.update({ 'name': username }, { $pull: { postid: req.params.postid } });
    }).then((result) => {
        console.log(result);
        if (result.n == 1)
            res.send({ 'deletepost': '1' });
        else
            res.send({ 'deletepost': '0', message: 'delete post failed' });
        return;
    }).catch((err) => {
        res.send({ 'deletepost': '0', message: 'db error' });
        console.log(err);
    });
    return;
});


//require text in body 
router.post('/search/:type/:page', function (req, res, next) {
    var type = req.params.type;
    var pageLimit = 6;
    var skipNum = (req.params.page - 1) * pageLimit;
    if (skipNum < 0) skipNum = 0;
    var text = req.body.text;
    if (!text) return res.send({ 'searchpost': '0', message: 'search text cannnot be null' });

    var textParts = defaultSegment(text);

    postCollection.find({
        'type': type, $or: [
            { titleIndex: { $in: textParts } },
            { contentIndex: { $in: textParts }}
        ]
    }, { limit: pageLimit, skip: skipNum }).
        then((result) => {
            res.send({ 'searchpost': '1', 'result': result });
            return;
        }).catch(err => {
            res.send({ 'searchpost': '0', message: 'db error' });
            console.log(err);
        });
});

module.exports = router;