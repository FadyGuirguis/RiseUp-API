const mongoose = require('mongoose');
const _ = require('lodash');
const {ObjectId} = require('mongodb');
OfficeHour = mongoose.model('OfficeHour');

module.exports.insertOfficeHour = async (req, res) => {
  var officeHour = req.body.officeHour;
  officeHour.user._id = new ObjectId();
  officeHour.expert._id = new ObjectId();
  officeHour.suggestedSlots = [{
    time: new Date()
  }]
  officeHour = new OfficeHour(officeHour);
  officeHour.save().then((officeHour) => {
    res.send({officeHour});
  }).catch((err) => {
    res.status(500).send({err});
  })
}
