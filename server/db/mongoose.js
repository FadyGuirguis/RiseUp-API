var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// var mongodbUri = 'mongodb://riseupadmin:riseupadmin@ds123799.mlab.com:23799/riseupconnect';
// mongoose.connect(mongodbUri);
mongoose.connect('mongodb://localhost:27017/RiseUp');
module.exports = {
  mongoose
};
