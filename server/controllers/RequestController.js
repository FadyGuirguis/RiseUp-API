const mongoose = require('mongoose');
const Request = mongoose.model('Request');
const User = mongoose.model('User');

module.exports.getAllRequests = async (req, res) => {
    Request.find().then((requests) => {
      res.status(200).send({requests});
    }, (e) => {
      res.status(500).send(e);
    })
}

module.exports.addRequest = async (req, res) => {
  if(!req.body.request) {
    res.status(400).send('Request is required');
  }
  else if(!req.body.request.description) {
    res.status(400).send('You must add description');
  }
  else {
    var request = new Request({
      user: {
        _id: req.user._id,
        name : req.user.profile.fullName
      },
      description: req.body.request.description
    })

    request.save().then((request) => {
      res.status(200).send({request});
    }, (e) => {
      res.status(500).send(e);
    })
  }
}

module.exports.rejectRequest = async (req, res) => {
    var id = req.params.id;
    Request.find({_id: id}).then((oldRequest) => {
      if(! oldRequest) {
        return res.status(404).send();
      }
      var request = oldRequest[0];
      request.status = 'Rejected';

      return Request.findByIdAndUpdate(id, {$set: request}, {new: true})
    }).then((newRequest) => {
      res.status(200).send({newRequest});
    }).catch((err) => {
      res.status(500).send(err);
    })
}

module.exports.acceptRequest = async (req, res) => {
  var id = req.params.id;

  Request.find({_id: id}).then((oldRequest) => {
    if(! oldRequest) {
      return res.status(404).send();
    }

    var request = oldRequest[0];
    request.status = 'Accepted';

    return Request.findByIdAndUpdate(id, {$set: request}, {new: true});
  }).then((newRequest) => {
    var userID = newRequest.user._id;
    return User.find({_id: userID});
  }).then((user) => {
    var getUser = user[0];
    var getUserID = getUser._id;
    getUser.roles.push('expert');
    return User.findByIdAndUpdate(getUserID, {$set: getUser}, {new: true});
  }).then((updatedUser) => {
    res.status(200).send({updatedUser});
  }).catch((err) => {
    res.status(500).send(err);
  })
}

module.exports.suspendExpert = async(req, res) => {
  var id = req.params.id;

  User.find({_id: id}).then((user) => {
    if(! user) {
      return res.status(404).send();
    }

    var getUser = user[0];
    var roles = getUser.roles;
    var newRoles = roles.filter((role) => role !== 'expert');
    getUser.roles = newRoles;

    return User.findByIdAndUpdate(id, {$set: getUser}, {new: true});
  }).then((updatedUser) => {
    res.status(200).send({updatedUser});
  }).catch((err) => {
    res.status(500).send(err);
  })
}
