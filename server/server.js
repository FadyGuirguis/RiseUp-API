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

var app = express();

app.use(bodyParser.json());

app.post('/register', asyncMiddleware(userController.createUser));
app.post('/login', asyncMiddleware(userController.loginUser));

// Announcements
// Anyone can get
app.get('/announcements', asyncMiddleware(announcementsCtlr.getAllAnnouncements));
// [TODO] Only Admins can post
app.post('/announcements', asyncMiddleware(announcementsCtlr.postAnnouncement));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
