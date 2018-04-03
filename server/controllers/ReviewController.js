const _ = require('lodash');
const mongoose = require('mongoose');
const {ObjectId} = require('mongodb');
Review = mongoose.model('Review');

module.exports.getReviewsOnUser = async (req, res) => {

    var userId = req.params.id;

    Review.find({ 'reviewed._id': userId }).then((reviews) => {
        res.send(reviews);
    }).catch((err) => {
        res.status(500).send(err);
    })

};