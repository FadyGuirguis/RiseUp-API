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
