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
  }).select('profile.fullName profile.rating, profile.achievements')
  .then((experts) => {
    res.send({experts});
  }).catch((err) => {
    res.status(500).send(err);
  })
};

module.exports.saveOfficeHour = async (req, res) => {
  var experts = req.body.experts;
  if (experts.length > 3 || experts.length == 0) {
    res.status(400).send({err: 'You have to select between 1 and 3 experts'});
  }
  if (!req.body.title || !req.body.description) {
    res.status(400).send({err: 'You have to supply a title and description'});
  }
  body = {
    user: {
      _id: req.user._id,
      name: req.user.profile.fullName,
    },
    title: req.body.title,
    description: req.body.description,
    createdOn: new Date(),
    lastModified: new Date(),
    status: 'pending'
  }
  var officeHours = []
  for (var expert of experts) {
    body.expert = {
      _id: expert._id,
      name: expert.profile.fullName
    }
    officeHours.push(new OfficeHour(body));
  }
  OfficeHour.insertMany(officeHours).then((officeHours) => {
    res.send();
  }).catch((err) => {
    res.status(500).send({});
  })

};
