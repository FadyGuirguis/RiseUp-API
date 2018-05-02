/*H

FILENAME: server.js

DESCRIPTION: This is the javascript file that loads all the files that include
database schemas and the callback functions. It includes the routes and it
serves the api on the current port.

AUTHOR: Fady Sameh & Zeyad Zaky & Shady Ayman & Daniel Achraf
& Abdelrahman Tarek

START DATE: 25 March 2018.

H*/
//module imports
var cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
var asyncMiddleware = require('express-async-handler');

//local files
var {mongoose} = require('./db/mongoose');

//models
var User = require('./models/user');
var Tag = require('./models/tag');
var Announcement = require('./models/Announcement');
var OfficeHour = require('./models/OfficeHour');
var Request = require('./models/request');
var Review = require('./models/Review');

//controllers
var userController = require('./controllers/UserController');
var tagController = require('./controllers/TagController');
var announcementsCtlr = require('./controllers/AnnouncementController');
var OfficeHoursController = require('./controllers/OfficeHoursController');
var requestController = require('./controllers/RequestController');
var reviewsController = require('./controllers/ReviewController');

var authModule = require('./middleware/authenticate');

var app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  })
);

//parsing request bodies
app.use(bodyParser.json());

// User routes
app.post('/register', asyncMiddleware(userController.createUser));

app.post('/login', asyncMiddleware(userController.loginUser));

app.post('/editProfile', authModule.authenticate,
asyncMiddleware(userController.editProfile));

app.post('/changePassword',  authModule.authenticate,
asyncMiddleware(userController.changePassword));

app.post('/logout', authModule.authenticate,
asyncMiddleware(userController.logout));

app.post('/searchByName',authModule.authenticate,
asyncMiddleware(userController.searchByName));

app.get('/user/:id',authModule.authenticate,
asyncMiddleware(userController.getUserByID));

app.get('/users/getByToken', authModule.authenticate,
asyncMiddleware(userController.getUserByToken));

// Tags routes
app.post('/tag', authModule.authenticate, authModule.authAdmin,
asyncMiddleware(tagController.addTag));

app.get('/tags', asyncMiddleware(tagController.getAllTags));

app.delete('/tag/:id', authModule.authenticate, authModule.authAdmin,
asyncMiddleware(tagController.removeTag));

// Announcements routes
app.get('/announcements',
asyncMiddleware(announcementsCtlr.getAllAnnouncements));

app.post('/announcement', authModule.authenticate, authModule.authAdmin,
asyncMiddleware(announcementsCtlr.postAnnouncement));

app.delete('/announcement/:id', authModule.authenticate, authModule.authAdmin,
asyncMiddleware(announcementsCtlr.deleteAnnouncement));

// Officehour routes
app.get('/officeHours',  authModule.authenticate,
asyncMiddleware(OfficeHoursController.getOfficeHours));

app.get('/officeHour/:id',  authModule.authenticate,
asyncMiddleware(OfficeHoursController.getOfficeHour));

app.post('/searchExperts', authModule.authenticate,
asyncMiddleware(OfficeHoursController.getExperts));

app.get('/allExperts',asyncMiddleware(OfficeHoursController.getAllExperts));

app.post('/officeHour', authModule.authenticate,
asyncMiddleware(OfficeHoursController.saveOfficeHour));

app.post('/acceptOfficeHour/:id',  authModule.authenticate, authModule.authExpert,
asyncMiddleware(OfficeHoursController.acceptOfficeHour));

app.post('/rejectOfficeHour/:id',  authModule.authenticate, authModule.authExpert,
asyncMiddleware(OfficeHoursController.rejectOfficeHour));

app.post('/confirmOfficeHour/:id',  authModule.authenticate,
asyncMiddleware(OfficeHoursController.confirmOfficeHour));

//Requests routes
app.post('/request', authModule.authenticate,
asyncMiddleware(requestController.addRequest));

app.get('/requests', authModule.authenticate, authModule.authAdmin,
asyncMiddleware(requestController.getAllRequests));

app.post('/rejectRequest/:id', authModule.authenticate, authModule.authAdmin,
asyncMiddleware(requestController.rejectRequest));

app.post('/acceptRequest/:id', authModule.authenticate, authModule.authAdmin,
asyncMiddleware(requestController.acceptRequest));

app.post('/suspendExpert/:id', authModule.authenticate, authModule.authAdmin,
asyncMiddleware(requestController.suspendExpert));

// Reviews routes
app.post('/review/:id', authModule.authenticate,
asyncMiddleware(reviewsController.postReview));

app.get('/reviews/:id', authModule.authenticate, authModule.authAdmin,
asyncMiddleware(reviewsController.getReviewsOnUser));

/* selecting the port: 3000 when it's runnng locally. When the api is deployed,
it uses the port saved in the Heroku environment*/
const port = process.env.PORT || 3000;

module.exports.app = app;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
