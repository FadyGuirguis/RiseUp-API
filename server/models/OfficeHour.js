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
  createdOn: Date,
  suggestedSlots: {
    slots: [Date],
    createdOn: Date
  },
  choosenSlot: {
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
  }
});

mongoose.model('OfficeHour', OfficeHourSchema);
