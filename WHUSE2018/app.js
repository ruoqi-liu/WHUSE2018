

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('./routes/Passport/Passport').passport;
var session = require('express-session');
var flash = require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userRouter = require('./routes/user');
var userInfoRouter = require('./routes/userinfo');
var postRouter = require('./routes/post');
var userPostRouter = require('./routes/userpost');
var userTagsRouter = require('./routes/usertags');
var newsRouter = require('./routes/news');
var tagsRouter = require('./routes/tags');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('meow'));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'meow',
    rolling: true,
    cookie: { maxAge: 60000000 }
}
)
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user', userRouter);
app.use('/userinfo',userInfoRouter);
app.use('/posts', postRouter);
app.use('/userpost', userPostRouter);
app.use('/usertags',userTagsRouter);
app.use('/news',newsRouter);
app.use('/tags',tagsRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log(req.method);
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3001, function () {
    console.log("WHUSE is listening at 3001. \n");
});

module.exports = app;
