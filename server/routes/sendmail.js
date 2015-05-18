var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();

var smtpTransport = nodemailer.createTransport({
    service: 'gmail',
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
    var mailOptions = {
        form: 'fangjie1100@gmail.com',
        bcc: '2196473880@qq.com',
        to: '349304351@qq.com',
        subject: 'test email',
        text: 'test email client'
    };

    mailOptions.to = req.body.to;
    mailOptions.subject = req.body.subject;
    mailOptions.text = req.body.body;

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