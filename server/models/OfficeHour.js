/*H

FILENAME: OfficeHour.js

DESCRIPTION: This is the javascript file that includes the database schema for
             the documents that are saved in the Officehours collection in our
             database.

AUTHOR: Fady Sameh

START DATE: 2 Apr 2018.

H*/
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var {ObjectId} = require('mongodb');

const OfficeHourSchema = mongoose.Schema({
  user: {
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    name: {
      type: String,
      minlength: 1,
      trim: true,
      required: true
    }
  },
  expert: {
    _id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    name: {
      type: String,
      minlength: 1,
      trim: true,
      required: true
    }
  },
  isUserReviewed: {
    type: Boolean,
    default: false
  },
  isExpertReviewed: {
    type: Boolean,
    default: false
  },
  createdOn: Date,
  suggestedSlots: {
    slots: [Date],
    createdOn: Date
  },
  chosenSlot: {
    slot: Date,
    createdOn: Date
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  status: {
    type: String
  },
  lastModified: Date
});

module.exports.OfficeHours = mongoose.model('OfficeHour', OfficeHourSchema);
