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
        type: number,
        required: true
    }

});

mongoose.model('Review', ReviewSchema);