var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/RiseUp'); //connecting to localhost database

module.exports = {
  mongoose
};
