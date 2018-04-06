const mongoose = require('mongoose');
const _ = require('lodash');
const {ObjectId} = require('mongodb');
OfficeHour = mongoose.model('OfficeHour');
User = mongoose.model('User');

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
  }, null, {
    sort: {
      lastModified: -1
    }
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
  if (!req.body.tags)
    return res.status(400).send({err: 'tags not recieved'});
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
  }).select('profile.fullName profile.rating profile.achievements')
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

module.exports.acceptOfficeHour = async (req, res) => {
  if (!req.body.officeHour)
    return res.status(400).send({err: "Office Hour wasn't recieved"});
  if (!req.body.officeHour.suggestedSlots || !req.body.officeHour.suggestedSlots.slots)
    return res.status(400).send({err: "Suggested slots were not recieved"});
  if (req.body.officeHour.suggestedSlots.slots.length > 3
      || req.body.officeHour.suggestedSlots.slots.length == 0)
    return res.status(400).send({err: "You need to select between 1 and 3 slots"});

  var id = req.params.id;

  OfficeHour.find({
    _id: id,
    'expert._id': req.user._id
  }).then((officeHours) => {
    if (officeHours.length == 0)
      return Promise.reject("This request has not been sent to you");
    var officeHour = officeHours[0];
    if (officeHour.status != 'pending')
      return Promise.reject("This office hour has already been replied to");
    officeHour.suggestedSlots.slots =  req.body.officeHour.suggestedSlots.slots;
    officeHour.suggestedSlots.createdOn = new Date();
    officeHour.lastModified = new Date();
    officeHour.status = 'accepted';
    return officeHour.save();
  }).then((officeHour) => {
    res.send({officeHour});
  }).catch((err) => {
    res.status(400).send({err});
  });
};

// module.exports.rejectOfficeHour = async (req, res) => {
//   var id = req.params.id;
//   OfficeHour.findByIdAndUpdate(id, {
//     $set: {
//       status: 'rejected',
//       lastModified: new Date()
//     }
//   }, {new:true}).then((officeHour) => {
//     res.send({officeHour});
//   }).catch((err) => {
//     res.status(400).send({err});
//   });
//
// };

module.exports.rejectOfficeHour = async (req, res) => {
  var id = req.params.id;
  OfficeHour.find({
    _id: id,
    'expert._id': req.user._id
  }).then((officeHours) => {
    if (officeHours.length == 0)
      return Promise.reject("This request has not been sent to you");
    var officeHour = officeHours[0];
    if (officeHour.status != 'pending')
      return Promise.reject("This office hour has already been replied to");
    officeHour.lastModified = new Date();
    officeHour.status = 'rejected';
    return officeHour.save();
  }).then((officeHour) => {
    res.send({officeHour});
  }).catch((err) => {
    res.status(400).send({err});
  });

};

// module.exports.confirmOfficeHour = async (req, res) => {
//   if (!req.body.officeHour)
//     return res.status(400).send({err: "Office Hour wasn't recieved"});
//   if (!req.body.officeHour.chosenSlot || !req.body.officeHour.chosenSlot.slot)
//     return res.status(400).send({err: "Chosen slot was not recieved"});
//   if (req.body.officeHour.suggestedSlots.slots.indexOf(req.body.officeHour.chosenSlot.slot) == -1)
//     return res.status(400).send({err: "The time slot you selected was not suggested by the expert"});
//   if (req.body.officeHour.status != 'accepted')
//     return res.status(400).send({err: "This office hour hasn't been accepted"});
//
//     OfficeHour.findByIdAndUpdate(req.body.officeHour._id, {
//       $set: {
//         'chosenSlot.slot': req.body.officeHour.chosenSlot.slot,
//         'chosenSlot.createdOn': new Date(),
//         lastModified: new Date(),
//         status: 'confirmed'
//       }
//     },  {new: true}).then((officeHour) => {
//       res.send({officeHour});
//     }).catch((err) => {
//       res.status(500).send({err});
//     })
//
//
// };

module.exports.confirmOfficeHour = async (req, res) => {
  if (!req.body.officeHour)
    return res.status(400).send({err: "Office Hour wasn't recieved"});
  if (!req.body.officeHour.chosenSlot || !req.body.officeHour.chosenSlot.slot)
    return res.status(400).send({err: "Chosen slot was not recieved"});

  var id = req.params.id;

    OfficeHour.find({
      _id: id,
      'user._id': req.user._id
    }).then((officeHours) => {
      if (officeHours.length == 0)
        return Promise.reject("This request is not yours");

      var officeHour = officeHours[0];
      if (officeHour.status == 'confirmed')
        return Promise.reject("You have already confirmed this office hour");
      if (officeHour.status != 'accepted')
        return Promise.reject("This office has not been accepted");

      for (var slot of officeHour.suggestedSlots.slots)
        if (slot.getTime() == new Date(req.body.officeHour.chosenSlot.slot).getTime()) {
          officeHour.chosenSlot.slot = req.body.officeHour.chosenSlot.slot;
          officeHour.chosenSlot.createdOn = new Date();
          officeHour.lastModified = new Date();
          officeHour.status = 'confirmed';
          return officeHour.save();
        }

     return Promise.reject("This slot was not suggested by the expert");
    }).then((officeHour) => {
      res.send({officeHour});
    }).catch((err) => {
      console.log(err);
      res.status(400).send({err});
    });


};
