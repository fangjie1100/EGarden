var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var model = {
        "success": 1,
        "result": []
    };

    for (var i = 0; i < 10; i++) {
        model.result.push({
            "id": i * 10,
            "title": 'learning english' + (i + 1),
            "url": 'http://baidu.com',
            "class": 'class ' + i,
            "start": moment().day(i).valueOf(), // Milliseconds
            "end": moment().day(i).valueOf() + 10 // Milliseconds
        });
    }

    res.send(model);
});

module.exports = router;
