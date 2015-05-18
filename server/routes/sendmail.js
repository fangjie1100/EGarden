var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

var smtpTransport = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        user: 'fangjie1100@gmail.com',
        pass: 'fangjie123'
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('sendmail', {
        title: 'E Graden'
    });
});

router.put('/', function (req, res, next) {
    console.log(req);
    //    var mailOptions = {
    //        to: '349304351@qq.com',
    //        subject: 'test email',
    //        text: 'test email client'
    //    };

    var mailOptions = {
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.body
    };

    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            res.end('error' + error);
        } else {
            console.log('message sent: ' + response.message);
            res.end('sent');
        }
    });
});

module.exports = router;