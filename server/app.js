var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var crypto = require('crypto');
var passport = require('passport');
var TqqStrategy = require('../lib/passport-tqq/').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new TqqStrategy({
    clientID: '101211799',
    clientSecret: '5955ec423d2fd84d5a70020cbcbd6508',
    callbackURL: 'http://visaandpassport.cn/callback'
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));


var app = express();




app.use(logger());
app.use(cookieParser());
app.use(bodyParser());
//app.use(methodOverride());
app.use(session({
    secret: 'keyboard cat',
    cookie: {
        maxAge: 60000
    }
}));

app.use(passport.initialize());
app.use(passport.session());



//app.use(passport.initialize());
//app.use(passport.session());

app.get('/auth/qq', function (req, res, next) {
    req.session = req.session || {};
    req.session.authState = crypto.createHash('sha1')
        .update(-(new Date()) + '')
        .digest('hex');
    passport.authenticate('qq', {
        state: req.session.authState
    })(req, res, next);
});


// GET /auth/qq/callback
// 通过比较认证返回的`state`状态值与服务器端`session`中的`state`状态值
// 决定是否继续本次授权
app.get('/callback', function (req, res, next) {
        console.log(req.session);
        console.log(req.session.authState);
        console.log(req.session.authState);
        console.log(req.query.state);

        if (req.session && req.session.authState && req.session.authState === req.query.state) {
            passport
                .authenticate('qq', {
                    failureRedirect: '/login'
                })(req, res, next);
        } else {
            return next(new Error('Auth State Mismatch'));
        }
    },
    function (req, res) {
        res.redirect('/account');
    });

app.get('/account', ensureAuthenticated, function (req, res) {
    res.render('account', {
        user: req.user,
        detail: JSON.stringify(req.user)
    });
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


//
//app.use(express.methodOverride());
//app.use(express.cookieParser())
//app.use(express.session({secret: 'blog.fens.me', cookie: { maxAge: 60000 }}));
app.use(passport.initialize());
app.use(passport.session());


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