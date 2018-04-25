/*H

FILENAME: RequestController.js

DESCRIPTION: This is the javascript file for the expert request functions.

FUNCTIONS:
           getAllRequests()
           addRequest()
           rejectRequest()
           acceptRequest()
           suspendExpert()

AUTHOR: Zeyad Zaky       START DATE: 3 Apr 2018.

H*/

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
    text: 'Congratulations! You have been approved as an expert.'
  }
  return options;
}

var rejectOptions = (recipent) => {
  var options = {
    from: 'Office hours',
    to: recipent,
    subject: 'Notification',
    text: 'We regret to inform you that your expert request has been rejected.'
  }
  return options;
}

//view all the pending expert requests by an admin.
module.exports.getAllRequests = async (req, res) => {
    Request.find({status: 'Pending'}).then((requests) => {
      res.status(200).send({requests});
    }, (e) => {
      res.status(500).send(e);
    })
}

//apply for an expert request by a user.
module.exports.addRequest = async (req, res) => {
  var id = req.user.id;

  //check if the user is already an expert
  if(req.user.roles.includes('expert')) {
    return res.status(400).send('You are already an expert');
  }

  //check if the user has a previous pending request
  Request.find({'user._id': id}).then((request) => {
    if(request) {
      var i;
      for(i = 0; i < request.length; i++) {
        if(request[i].status === 'Pending') {
          return res.status(400).send('You already have a pending request');
          break;
        }
      }
    }

    //check that the request and description are provided in the request
    if(!req.body.request) {
      return res.status(400).send('Request is required');
    }

    if(!req.body.request.description) {
      return res.status(400).send('You must add description');
    }

    var request = new Request({
      user: {
        _id: req.user._id,
        name : req.user.profile.fullName
      },
      description: req.body.request.description
    })

    //save the request to the database
    request.save().then((request) => {
      res.status(200).send({request});
    }, (e) => {
      res.status(500).send(e);
    })
  })
}

//reject an expert request by an admin.
module.exports.rejectRequest = async (req, res) => {
    var id = req.params.id;

    //check the correctness of the provided request id
    Request.find({_id: id}).then((oldRequest) => {
      if(! oldRequest[0]) {
        res.status(404).send('There is no request available with such id');
      }

      //check if the request is already evaluated
      if(oldRequest[0].status !== 'Pending') {
        return res.status(400).send('This request is already evaluated');
      }

      var request = oldRequest[0];
      var userID = request.user._id;

      //send an email to the user
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

      //change the status of the request to rejected
      return Request.find({_id: id});
    }).then((request) => {
        var getRequest = request[0];
        getRequest.status = 'Rejected';
      return Request.findByIdAndUpdate(id, {$set: getRequest}, {new: true});
    }).then((newRequest) => {
      return res.status(200).send({newRequest});
    }).catch((err) => {
      return res.status(500).send(err);
    })
}

//accept an expert request by an admin
module.exports.acceptRequest = async (req, res) => {
  var id = req.params.id;

  //check the correctness of the provided request id
  Request.find({_id: id}).then((oldRequest) => {
    if(! oldRequest[0]) {
      return res.status(404).send('There is no request available with such id');
    }

    //check if the request is already evaluated
    if(oldRequest[0].status !== 'Pending') {
        return res.status(400).send('This request is already evaluated');
    }

    var request = oldRequest[0];
    request.status = 'Accepted';

    //change status of the request to accpeted
    return Request.findByIdAndUpdate(id, {$set: request}, {new: true});
  }).then((newRequest) => {
    var userID = newRequest.user._id;

    //send an email to the user
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

    //update the user roles to include expert
    return User.findByIdAndUpdate(getUserID, {$set: getUser}, {new: true});
  }).then((updatedUser) => {
    res.status(200).send({updatedUser});
  }).catch((err) => {
    res.status(500).send(err);
  })
}

//suspend an expert by an admin.
module.exports.suspendExpert = async(req, res) => {
  var id = req.params.id;

  //check the correctness of the provided user id
  User.find({_id: id}).then((user) => {
    if(! user[0]) {
      return res.status(404).send('There is no expert available with such id');
    }

    //check if the user is already an expert
    if(! user[0].roles.includes('expert')) {
      return res.status(400).send('This user is not an expert');
    }

    var getUser = user[0];
    var roles = getUser.roles;
    var newRoles = roles.filter((role) => role !== 'expert');
    getUser.roles = newRoles;

    //remove expert from the roles of the user
    return User.findByIdAndUpdate(id, {$set: getUser}, {new: true});
  }).then((updatedUser) => {
    res.status(200).send({updatedUser});
  }).catch((err) => {
    res.status(500).send(err);
  })
}
