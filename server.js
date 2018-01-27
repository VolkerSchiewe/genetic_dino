var express = require('express');
var app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/'));
app.listen(PORT);
console.log(`Server listening on http://localhost:${PORT}\nQuit the server with ^C.`);