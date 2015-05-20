var express = require('express');
var router = express.Router();
var pg = require('pg');

var conString = 'postgres://nhopjsddswsugl:UZBghjvpTcHj6SlXUJLcZ5zFSF@ec2-23-23-81-221.compute-1.amazonaws.com:5432/d1ckktjhmd70fh';

var client = new pg.Client(conString);
client.connect();

client.query("CREATE TABLE IF NOT EXISTS emps(firstname varchar(64), lastname varchar(64))");
client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Ronald', 'McDonald']);
client.query("INSERT INTO emps(firstname, lastname) values($1, $2)", ['Mayor', 'McCheese']);


/* GET home page. */
router.get('/', function (req, res, next) {
    var query = client.query("SELECT firstname, lastname FROM emps ORDER BY lastname, firstname");
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        console.log(JSON.stringify(result.rows, null, "    "));
        client.end();
    });

    res.render('class', {
        title: 'E Graden'
    });
});

router.post('/', function (req, res, next) {
    var query = client.query('select * from emps');
    query.on('row', function (row, result) {

    });
})

module.exports = router;