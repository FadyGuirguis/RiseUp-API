//module imports
var express = require('express');
var bodyParser = require('body-parser');

//local files
var {mongoose} = require('./db/mongoose');

var app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
