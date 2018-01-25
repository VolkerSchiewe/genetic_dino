var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

var PORT = 8080;
app.listen(PORT);
console.log(`Server listening on ${PORT}\nQuit the server with ^C.`);