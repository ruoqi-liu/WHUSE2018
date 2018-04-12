var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var monk = require('monk');
var db = monk('localhost:27017/WHUSE');
var collection = db.get('user');
var postCollection = db.get('post');

passport.serializeUser(function (user, done) {//写入session,done 就是一个中间件，接受顺序为err,user,info并将他们写入session
    console.log('serializing.');
    done(null, user);
}
);

passport.deserializeUser(function (user, done) {//写入session
    console.log('deseralizing');
    done(null, user);
}
);

passport.use('logIn', new LocalStrategy(
    {
        usernameField: 'name',
        passwordField: 'password',
        passReqToCallback: false
    }, function (username, password, done) {//设置为true之后第一个参数会将req传入    
        if (!username || !password)
            done(null, false, { 'valid': '0', message: 'username or password cannot be null.' });

        collection.find({ name: username, password: password }, {
            fields: { name: 1, password: 1, userinfo:1 } }, function (err, result) {
            if (err) throw err;
            
            if (result)
                if (result.length == 1) {
                    result = result[0];
                    if (!result.userinfo.photo) result.userinfo.photo = '/images/0001.jpg';
                    return done(null, { 'username': username, 'photo': result.userinfo.photo,'valid': '1' });
                }
                else
                    return done(null, false, { 'valid': '0', message: 'username or password incorrect.' });
        });
        return;
    }
));

passport.use('signUp', new LocalStrategy(
    {
        usernameField: 'name',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        if (!username || !password)
            done(null, false, { 'valid': '0', message: 'username or password cannot be null.' });
        collection.insert({
            name: username, password: password, userinfo: { photo:'/images/0001.jpg'}}, function (err, result) {
            if (err)
                if (err.code == 11000)
                    return done(null, false, { message: 'duplicated username', 'valid': '0' });
                else
                    return done(null, false, { message: 'unknown error', 'valid': '0' });
            else
                return done(null, { 'username': username, 'photo': result.userinfo.photo, valid: '1' });

            return;
        });
        return;
    }
));

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send({ 'tologin': '1' });
    //res.setHeader ('method', 'GET' );
    //res.redirect('/users');
    return;
}

var userLogout = function (req, res, next) {
    if (req.isAuthenticated()) req.logout();
    res.send({ 'islogout': '1' });
    return;
}

var userNameVerify = function (req, res, next) {
    var user = req.session.passport.user;
    var name = req.params.name;//name 应该不会是null,因为在url path中
    if (!name||name != user.name) return res.send({ 'tologin': '1','message':'incorrespond username' });
    return next();
}

var postOwnerVerify = function (req, res, next) {
    var user = req.session.passport.user;
    var postid = req.params.postid;
    
    postCollection.find({ '_id': postid }, { fields: { postinfo: 1 } }).then((result) => {
        if (result.length == 0) return res.send({ 'ispostowner': '0', message: 'incorrect postid' });
        result = result[0];
        var postname = result.postinfo.username;
        if (postname != user.name) return res.send({ 'ispostowner': '0', message: 'not the owner' });
        return next();
    }).catch((err) => { console.log(err);});
};

exports.userNameVerify = userNameVerify;
exports.authentic = isAuthenticated;
exports.passport = passport;
exports.logout = userLogout;
