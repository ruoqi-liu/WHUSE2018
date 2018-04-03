var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var monk = require('monk');
var db = monk('localhost:27017/WHUSE');
var collection = db.get('user');

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
        collection.find({ name: username, password: password }, { fields: { name: 1, password: 1,image: 1 } }, function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result)
                if (result.length == 1) {
                    return done(null, { 'username': username,'photo':result.image ,'valid': '1' });
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
        collection.insert({ name: username, password: password }, function (err, result) {
            if (err)
                if (err.code == 11000)
                    return done(null, false, { message: 'duplicated username', 'valid': '0' });
                else
                    return done(null, false, { message: 'unknown error', 'valid': '0' });
            else
                return done(null, { 'username': username, 'photo': result.image, valid: '1' });

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

exports.authentic = isAuthenticated;
exports.passport = passport;
exports.logout = userLogout;
