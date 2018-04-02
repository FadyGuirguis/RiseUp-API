var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//var mongodbUri = 'mongodb://riseupadmin:riseupadmin@ds123799.mlab.com:23799/riseupconnect';
var mongodbUri = 'mongodb://localhost:27017/RiseUp';

mongoose.connect(mongodbUri);

module.exports = {
  mongoose
};
