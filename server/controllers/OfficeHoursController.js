const mongoose = require('mongoose');
const _ = require('lodash');
const {ObjectId} = require('mongodb');
OfficeHour = mongoose.model('OfficeHour');
User = mongoose.model('User');

module.exports.insertOfficeHour = async (req, res) => {
  var officeHour = req.body.officeHour;
  officeHour.user._id = new ObjectId();
  officeHour.expert._id = new ObjectId();
  officeHour.createdOn = new Date();
  officeHour = new OfficeHour(officeHour);
  officeHour.save().then((officeHour) => {
    res.send({officeHour});
  }).catch((err) => {
    res.status(500).send({err});
  })
};

module.exports.getOfficeHours = async (req, res) => {
  var id = req.user._id;
  OfficeHour.find({
    $or: [
      {
        'user._id': id
      },
      {
        'expert._id': id
      }
    ]
  }).select('user expert title status lastModified')
    .then((officeHours) => {
      res.send({officeHours});
    })
    .catch((err) => {
      res.status(500).send({err});
    });
};

module.exports.getOfficeHour = async (req, res) => {
  var id = req.params.id;
  OfficeHour.findOne({_id:id}).then((officeHour) => {
    if (officeHour.user._id.equals(req.user._id) || officeHour.expert._id.equals(req.user._id))
      return res.send({officeHour});
    res.status(401).send();

  }).catch((err) => {
    res.status(500).send();
  })
};

module.exports.getExperts = async (req, res) => {
  var tags = req.body.tags;
  var interests = (req.body.tags.length == 0) ? req.user.profile.interests : [];
  console.log(tags);
  User.find({
    roles: {
      $in: ['expert']
    },
    $or: [
      {
        'profile.expertIn': {
          $all: tags
        }
      },
      {
        'profile.expertIn': {
          $in: interests
        }
      }
    ]
  }).select('profile.fullName')
  .then((experts) => {
    res.send({experts});
  }).catch((err) => {
    res.status(500).send(err);
  })
};
