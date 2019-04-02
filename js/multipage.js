var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send('jaime les licornes');
});

app.get('/Patience_Chrome', function(req, res) {
    res.send(Patience_Chrome.html);
});

app.listen(8080);
