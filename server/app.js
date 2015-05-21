var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var passport = require('passport');
var QQStrategy = require('passport-qq').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new QQStrategy({
    clientID: '101211799',
    clientSecret: '5955ec423d2fd84d5a70020cbcbd6508',
    callbackURL: 'http://visaandpassport.cn/callback'
}, function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    process.nextTick(function () {
        return done(null, profile);
    });
}));


var app = express();
app.use('/auth/qq',
    passport.authenticate('qq'),
    function (req, res) {
        // The request will be redirected to qq for authentication, so this
        // function will not be called.
        res.redirect('/');
    });


app.use('/callback',
    passport.authenticate('qq', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        console.log('login is ok');
        res.redirect('/');
    });

app.use('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});






var routes = require('./routes/index');
var users = require('./routes/users');
var classroom = require('./routes/class');
var calendar = require('./routes/calendar');
var calresult = require('./routes/calresult');
//var callback = require('./routes/callback');
var login = require('./routes/login');
var about = require('./routes/about');
var register = require('./routes/register');
var teachers = require('./routes/teachers');
var testchat = require('./routes/testchat');
var test = require('./routes/test');
var sendMail = require('./routes/sendmail');


//app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, '/../public/views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

//uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../public')));
app.use('/bower_components', express.static(path.join(__dirname, '/../bower_components')));

app.use('/', routes);
app.use('/users', users);
app.use('/class', classroom);
app.use('/calendar', calendar);
app.use('/calendarresult', calresult);
//app.use('/callback', callback);
app.use('/login', login);
app.use('/about', about);
app.use('/register', register);
app.use('/teachers', teachers);
app.use('/test', test);
app.use('/testchat', testchat);
app.use('/sendmail', sendMail);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}


module.exports = app;