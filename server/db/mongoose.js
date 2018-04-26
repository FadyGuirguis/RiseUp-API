/*H

FILENAME: mongoose.js

DESCRIPTION: This is the javascript file that connects the API to the databse.

AUTHOR: Fady Sameh

START DATE: 25 March 2018.

H*/
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

if(process.env.NODE_ENV !=='test'){
  //producrion database when deployed
  var mongodbUri =
  'mongodb://riseupadmin:riseupadmin@ds123799.mlab.com:23799/riseupconnect';
} else{
  //local database while testing
  var mongodbUri = 'mongodb://localhost:27017/RiseUp';
}

mongoose.connect(mongodbUri);

module.exports = {
  mongoose
};
