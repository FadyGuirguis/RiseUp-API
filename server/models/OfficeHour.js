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

mongoose.model('OfficeHour', OfficeHourSchema);
