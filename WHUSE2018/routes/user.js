
var express = require('express');
var session = require('express-session');
var flash = require('connect-flash');
var router = express.Router();
var passport = require('./Passport/Passport').passport;
var isAuthentic = require('./Passport/Passport').authentic;

var monk = require('monk');
var db = monk('localhost:27017/WHUSE');
var collection = db.get('user');

router.use(session({
    resave: true,  
    saveUninitialized: true ,
    secret: 'meow',
    rolling:true,
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
                res.send(info);
                return;
            }
            else
            req.logIn(user, function (err) {

                if (err) return next(err);
                res.send({ valid: '1', 'username': user.username });
            });
            return;
        })(req,res,next);
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


router.post('/', function (req, res, next) {//add
    passport.authenticate('signUp', function (err, user, info) {
        if (err) next(err);

        if (!user) {
            req.flash('error', {msg:info.message});
            req.logout();
            res.send(info);
            return;
        }
        else
            req.logIn(user, function (err) {

                if (err) return next(err);
                res.send({ valid: '1', 'username': user.username });
            });
        return;
    })(req, res, next);
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
});

router.put('/', isAuthentic, function (req, res, next) {//update
    if (!req.body.content) return;
    console.log(req.body.content);
    collection.update({ name: req.body.name, password: req.body.password }, req.body.content, function (err, result) {
        if (err)
            if (err.code == 11000)
                res.send({ succeed: '0', error: 'duplicated name' });
            else
                res.send({ succeed: '0', error: 'unkonwn' });
        else if (result.n > 0)
            res.send({ succeed: '1' });
        else
            res.send({ succeed: '0', error: 'invalid password' });
        return;
    }
    );
    return;
});

router.delete('/', isAuthentic,function (req, res, next) {//delete
    collection.remove({ name: req.body.name, password: req.body.password }, function (err, result) {
        if (err) {
            res.send({ succeed: '0', error: 'unknown' });
            return;
        }

        res.send({ succeed: '1' });
    });
    return
});


module.exports = router;