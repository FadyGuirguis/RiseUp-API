//module imports
var express = require('express');
var bodyParser = require('body-parser');
var asyncMiddleware = require('express-async-handler');

//local files
var {mongoose} = require('./db/mongoose');
var User = require('./models/user');
var userController = require('./controllers/userController');


var app = express();

app.use(bodyParser.json());

app.post('/register', asyncMiddleware(userController.createUser));
app.post('/login', asyncMiddleware(userController.loginUser));


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
