'use strict';

const PORT = 8080;

var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('app'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/app/index.html'));
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
