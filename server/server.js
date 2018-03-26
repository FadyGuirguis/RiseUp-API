//module imports
var express = require('express');
var bodyParser = require('body-parser');
var asyncMiddleware = require('express-async-handler');


//local files
var {mongoose} = require('./db/mongoose');
var User = require('./models/user');
var userController = require('./controllers/userController');

var Announcement = require('./models/Announcement');
var announcementsCtlr = require('./controllers/AnnouncementController');

var authModule = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.post('/register', asyncMiddleware(userController.createUser));
app.post('/login', asyncMiddleware(userController.loginUser));

// Announcements
app.get('/announcements', asyncMiddleware(announcementsCtlr.getAllAnnouncements));
app.post('/announcements', authModule.authAdmin, asyncMiddleware(announcementsCtlr.postAnnouncement));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
