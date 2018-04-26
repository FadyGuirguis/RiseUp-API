/*H

FILENAME: tag.js

DESCRIPTION: This is the javascript file for the predefined tag schema.

AUTHOR: Zeyad Zaky

START DATE: 26 March 2018.

H*/

const mongoose = require('mongoose');

const TagSchema = mongoose.Schema({
  tag: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    lowercase: true,
    unique : true
  }
});

mongoose.model('Tag', TagSchema);
