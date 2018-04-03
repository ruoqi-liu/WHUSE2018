
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

router.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'meow',
    rolling: true,
    cookie: { maxAge: 60000000 }
}
)
);

router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

router.post('/login', function (req, res, next) {
    passport.authenticate('logIn',
        function (err, user, info) {//user and info are passed by the PassportChain not in the session
            if (err) return next(err);
            console.log(req.session);
            if (!user) {
                req.flash('error', { msg: info.message });
                req.logout();
                res.send({'islogin':'0','message':info.message});
                return;
            }
            else
                req.logIn(user, function (err) {

                    if (err) return next(err);
                    res.send({ 'islogin': '1', 'username': user.username });
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


router.post('/register', function (req, res, next) {//add
    passport.authenticate('signUp', function (err, user, info) {
        if (err) next(err);

        if (!user) {
            req.flash('error', { msg: info.message });
            req.logout();
            res.send({ 'isregister':'0','message':info.message });
            return;
        }
        else
            req.logIn(user, function (err) {

                if (err) return next(err);
                res.send({ 'isregister': '1', 'username': user.username });
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

router.put('/:name', isAuthentic, function (req, res, next) {//update
    if (!req.body.content) return;
    console.log(req.params.name);
    collection.update({ name: req.params.name, password: req.body.password }, req.body.content, function (err, result) {
        if (err)
            if (err.code == 11000)
                res.send({ 'isupdate': '0', 'message': 'duplicated name' });
            else
                res.send({ 'isupdate': '0', 'message': 'unkonwn' });
        else if (result.n > 0)
            res.send({ 'isupdate': '1' });
        else
            res.send({ 'isupdate': '0', 'message': 'invalid password' });
        return;
    }
    );
    return;
});

router.delete('/:name', isAuthentic, function (req, res, next) {//delete
    collection.remove({ name: req.params.name, password: req.body.password }, function (err, result) {
        if (err) {
            res.send({ 'isdelete': '0', 'message': 'unknown' });
            return;
        }

        res.send({ 'isdelete': '1' });
    });
    return
});

router.use('/logout', logout
 );

module.exports = router;