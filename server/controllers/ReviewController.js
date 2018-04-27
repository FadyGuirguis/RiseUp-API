/*

FILENAME: ReviewController.js

DESCRIPTION:    This is Controller javascript file for Review.
                It contains the logic for retreiving and submitting reviews on the expert and the user
                by the other, upon an OfficeHour.
                They are called when a corresponding endpoint receives an HTTP request (GET, POST).

FUNCTIONS:
          getReviewsOnUser
          postReview

AUTHOR:     Shadi Barghash
START DATE: 18-April-2018

*/

const _ = require('lodash');
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');
Review = mongoose.model('Review');
OfficeHour = mongoose.model('OfficeHour');
User = mongoose.model('User');

module.exports.getReviewsOnUser = async (req, res) => {

    var userId = req.params.id;

    Review.find({ 'reviewed._id': userId }).then((reviews) => {
        res.send({ reviews });
    }).catch((err) => {
        res.status(500).send(err);
    });

};

module.exports.postReview = async (req, res) => {

    if(!req.body.review)
        return res.status(400).send({err: 'No review'});

    if(!req.body.review.rating)
        return res.status(400).send({err: 'Rating not specified'});

    if(!req.body.review.description)   
        return res.status(400).send({err: 'Description not specified'});

    if (!ObjectId.isValid(req.params.id))
      return res.status(400).send({err: 'Invalid Office Hour id'});

    var officeHourId = req.params.id;

    var body  = { // body of the new Review doc that will be saved to DB
      officeHours: req.params.id,
      description: req.body.review.description,
      rating: req.body.review.rating
    }

    OfficeHour.findOne({_id: officeHourId}).then((officeHour) => {

      if (!officeHour)
        return Promise.reject("Office hour not found");

      // User reviewing
      if (officeHour.user._id.equals(req.user._id)) {

        if (officeHour.isExpertReviewed == true)
          return Promise.reject("You've already submitted a review");

        officeHour.isExpertReviewed = true;
        body.reviewer = officeHour.user;
        body.reviewed = officeHour.expert;
      }
      // Expert reviewing
      else if (officeHour.expert._id.equals(req.user._id)) {

        if (officeHour.isUserReviewed == true)
          return Promise.reject("You've already submitted a review");

        officeHour.isUserReviewed = true;
        body.reviewer = officeHour.expert;
        body.reviewed = officeHour.user;
      }
      // Do not allow user/expert to review on this officeHour except the ones associated with it.
      else
        return Promise.reject("This office hour is not related to you");

      // Update the DB as 'isUserReviewed' or 'isExpertReviewed' was updated.
      return officeHour.save();

    }).then((officeHour) => {

      if (officeHour.user._id.equals(req.user._id))
        return User.findOne({_id: officeHour.expert._id});
      else
        return User.findOne({_id: officeHour.user._id});

    })
    // Update the average rating of the user/expert being reviewed
    .then((user) => {

      // Calculate
      var newRating =
        (user.profile.rating.rating * user.profile.rating.count + req.body.review.rating) 
        / (user.profile.rating.count + 1);

      // Update
      user.profile.rating.rating = newRating;
      user.profile.rating.count = user.profile.rating.count + 1;

      // Save that update in the DB
      return user.save();

    })
    // Create a new Review doc and save it to DB (finally)
    .then((user) => {
      var review = new Review(body);
      return review.save();
    })
    // Send the review to the sender in response
    .then((review) => {
      res.send({review});
    }).catch((err) => {
      res.status(400).send({err});
    });

};
