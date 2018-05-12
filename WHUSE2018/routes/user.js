
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
//router.use(passport.initialize());
//router.use(passport.session());
//router.use(flash());


//required body.name,password
router.post('/login', function (req, res, next) {
    passport.authenticate('logIn',
        function (err, user, info) {//user and info are passed by the PassportChain not in the session
            if (err) return next(err);
            if (!user) {
                req.flash('error', { msg: info.message });
                req.logout();
                res.send({ 'islogin': '0', 'message': info.message });
                return;
            }
            else
                req.logIn(user, function (err) {

                    if (err) return next(err);
                    res.send({ 'islogin': '1', 'username': user.username, 'photo': user.photo });
                });
            return;
        })(req, res, next);
}
);

// function (req, res, next) {//select
//    collection.find({ name: req.headers.name, password: req.headers.password }, function (err, result) {
//        if (err) throw err;
//        if (result)
//            if (result.length == 1) {
//                res.send({ valid: '1' });
//            }
//            else
//                res.send({ 'valid': '0' });
//    });
//    return;
//}

//required body.name,password
router.post('/register', function (req, res, next) {//add
    passport.authenticate('signUp', function (err, user, info) {
        if (err) return next(err);
        if (!user) {
            req.flash('error', { msg: info.message });
            req.logout();
            res.send({ 'isregister': '0', 'message': info.message });
            return;
        }
        else
            req.logIn(user, function (err) {

                if (err) return next(err);
                res.send({ 'isregister': '1', 'username': user.username, 'photo': user.photo });
            });
        return;
    })(req, res, next);
});

//collection.insert({ name: req.body.name, password: req.body.password }, function (err, result) {
//    if (err)
//        if (err.code == 11000)
//            res.send({ 'succeed': '0', 'error': 'duplicated name' });
//        else
//            res.send({ 'succeed': '0', 'error': 'unkonwn' });
//    else
//        res.send({ succeed: '1' })

//    return;
//});
//return;

//required body.password,content:{name:,password:(both optional)}
router.put('/:name', isAuthentic, function (req, res, next) {//update username or password
    if (!req.body.content) return res.send({ 'isupdate': '0', 'message': 'content null' });
    var content = req.body.content;
    var updateQuery = { 'name': content.name };
    if (content.password)
        updateQuery['password'] = content.password;
    var password = req.body.password;
    var findQuery = { name: req.params.name, 'password': password };
    if(!password||password.length==0) 
          delete findQuery['password'];
    collection.update(findQuery, {
        $set: updateQuery
    }
        , function (err, result) {
            console.log(result);
            if (err)
                if (err.code == 11000)
                    res.send({ 'isupdate': '0', 'message': 'duplicated name' });
                else
                    res.send({ 'isupdate': '0', 'message': 'unkonwn' });
            else if (result.ok == 1)
            {
                req.user.username = content.name;
                res.send({ 'isupdate': '1' });
            }
            else
                res.send({ 'isupdate': '0', 'message': 'password no change' });
            return;
        }
    );
    return;
});


//required body.password
router.delete('/:name', isAuthentic, function (req, res, next) {//delete
    collection.remove({ name: req.params.name, password: req.body.password }, function (err, result) {
        if (err) {
            res.send({ 'isdelete': '0', 'message': 'unknown' });
            return;
        }
        if (result.result.n == 1) {
            res.send({ 'isdelete': '1' });
            req.logout();
            //console.log(req.user);
        }
        else
            res.send({'isdelete':'0'});
        return;
    });
});


//required 
router.get('/:name', isAuthentic, userNameVerify, function (req, res, next) {//user name,userinfo,tags,posts[postid,title]
    var limitNum = 3;
    collection.find({ name: req.params.name }, { fields: { password: 0 } }).then((doc) => {
        if (doc.length != 1)
            return res.send({ 'getuser': '0', message: 'db.find result incorrect' });
        doc = doc[0];
        req.flash('userdoc', doc);
        var postids = doc.postid;
        if(!postids) postids = [];

        postCollection.find({ '_id': { '$in': postids } }, { /*fields: { title: 1 }*//*limit: limitNum*/ }).then((posts) => {
            delete doc['postid'];
            doc['posts'] = posts;//posts: array of post
            return res.send({ 'getuser': '1', user: doc });
        } );
    }
    ).catch(err => { console.log(err);});

}
);


router.use('/logout', logout);

module.exports = router;
