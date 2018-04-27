/*

FILENAME: Review.js

DESCRIPTION:    This file specifies the Mongo Database Schema for the "Review",
                and exports its Model for use in other javascript files.

AUTHOR: Shadi Barghash
START DATE: 18-April-2018

*/

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {ObjectId} = require('mongodb');

const ReviewSchema = mongoose.Schema({

    reviewer: {
        _id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        name: String
    },
    
    reviewed: {
        _id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        name: String
    },

    officeHours: {
        type: Schema.Types.ObjectId,
        required: true
    },

    description: {
        type: String
    },

    rating: {
        type: Number,
        required: true
    }

});

module.exports.Review = mongoose.model('Review', ReviewSchema);