/*H

FILENAME: request.js

DESCRIPTION: This is the javascript file for the expert request schema.

AUTHOR: Zeyad Zaky

START DATE: 3 April 2018.

H*/

const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
  user: {
    _id: {
      type: String,
    },
    name: {
      type: String,
    }
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending'
  }
});

module.exports.Request = mongoose.model('Request', RequestSchema);
