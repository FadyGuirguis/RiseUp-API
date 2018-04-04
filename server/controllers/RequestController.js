const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const Request = mongoose.model('Request');
const User = mongoose.model('User');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'riseup.startups@gmail.com',
    pass: 'RiseUp123'
  }
});

var acceptOptions = (recipent) => {
  var options = {
    from: 'Office hours',
    to: recipent,
    subject: 'Notification',
    text: 'Congratulations! You have been approved as an expert'
  }
  return options;
}

var rejectOptions = (recipent) => {
  var options = {
    from: 'Office hours',
    to: recipent,
    subject: 'Notification',
    text: 'We are sorry to inform you that your expert request has been rejected'
  }
  return options;
}

module.exports.getAllRequests = async (req, res) => {
    Request.find().then((requests) => {
      res.status(200).send({requests});
    }, (e) => {
      res.status(500).send(e);
    })
}

module.exports.addRequest = async (req, res) => {
  var id = req.user.id;

  Request.find({'user._id': id}).then((request) => {
    if(request) {
      if(request[0].status === 'Pending') {
        return res.status(400).send('You already have a pending request');
      }
    }

    if(!req.body.request) {
      return res.status(400).send('Request is required');
    }
    else if(!req.body.request.description) {
      return res.status(400).send('You must add description');
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
  })
}

module.exports.rejectRequest = async (req, res) => {
    var id = req.params.id;
    Request.find({_id: id}).then((oldRequest) => {
      if(! oldRequest) {
        return res.status(404).send();
      }

      if(oldRequest[0].status !== 'Pending') {
          return res.status(400).send('This request is already evaluated');
      }

      var request = oldRequest[0];
      request.status = 'Rejected';
      var userID = request.user._id;

      return User.find({_id: userID});
    }).then((user) => {
      transporter.sendMail(rejectOptions(user[0].email), (err, info) => {
        if(err) {
          console.log(err);
        }
        else {
          console.log('Email sent:' + info.response);
        }
      })

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

    if(oldRequest[0].status !== 'Pending') {
        return res.status(400).send('This request is already evaluated');
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
    transporter.sendMail(acceptOptions(getUser.email), (err, info) => {
      if(err) {
        console.log(err);
      }
      else {
        console.log('Email sent:' + info.response);
      }
    })
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

    if(! user[0].roles.includes('expert')) {
      return res.status(400).send('This user is not an expert');
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
