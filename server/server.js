//module imports
var express = require('express');
var bodyParser = require('body-parser');
var asyncMiddleware = require('express-async-handler');

//local files
var {mongoose} = require('./db/mongoose');

var User = require('./models/user');
var Tag = require('./models/tag');
var Announcement = require('./models/Announcement');
var OfficeHour = require('./models/OfficeHour');

var userController = require('./controllers/UserController');
var tagController = require('./controllers/TagController');
var announcementsCtlr = require('./controllers/AnnouncementController');
var OfficeHoursController = require('./controllers/OfficeHoursController');
var authModule = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

// User
app.post('/register', asyncMiddleware(userController.createUser));
app.post('/login', asyncMiddleware(userController.loginUser));
app.post('/editProfile', authModule.authenticate, asyncMiddleware(userController.editProfile));
app.post('/changePassword',  authModule.authenticate, asyncMiddleware(userController.changePassword));
app.post('/logout', authModule.authenticate, asyncMiddleware(userController.logout));
// Tags
app.post('/tag', authModule.authenticate, authModule.authAdmin,asyncMiddleware(tagController.addTag));
app.get('/tags', authModule.authenticate, asyncMiddleware(tagController.getAllTags));
app.delete('/tag/:id', authModule.authenticate, authModule.authAdmin, asyncMiddleware(tagController.removeTag));

// Announcements
app.get('/announcements', asyncMiddleware(announcementsCtlr.getAllAnnouncements));
app.post('/announcement', authModule.authenticate, authModule.authAdmin, asyncMiddleware(announcementsCtlr.postAnnouncement));
app.delete('/announcement/:id', authModule.authenticate, authModule.authAdmin, asyncMiddleware(announcementsCtlr.deleteAnnouncement));

// Office OfficeHour
app.post('/officeHour', asyncMiddleware(OfficeHoursController.insertOfficeHour));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
