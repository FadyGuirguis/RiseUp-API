/*H

FILENAME: UserControleer.js

DESCRIPTION: This is the javascript file for the UserController,
             its main functionality is defining all method concerning the user (user - expert - admin)

FUNCTIONS:
           createUser
           loginUser
           editProfile
           changePassword
           logout
           searchByName
           getUserByID
           getUserByToken

AUTHOR: Daniel Achraf & Fady Sameh        START DATE: 3 Apr 2018.

H*/

const mongoose = require('mongoose');
const _ = require('lodash');
moment = require('moment'),
User = mongoose.model('User');

//createUser: This method is responsible for registering a new user and logging him in automatically returning his token.
//He has to provide an unused email and a password of min length of 6 and a fullName name of min length of 6
module.exports.createUser = async (req, res) => {

  try {
    var body = _.pick(req.body.user, ['email', 'password']);
    body.profile = {};
    body.profile.fullName = req.body.user.profile.fullName;
  } catch (error) {
    res.status(400).send('Please enter an email or password');
  }

  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();

  }).then((token) => {
    res.header('x-auth', token).send({ user });
  }).catch((e) => {
    if (e.name == 'ValidationError') {
      if (typeof e.errors.email !== 'undefined') {
        res.status(400).send(e.errors.email.message);
      } else {
        res.status(400).send(e);
      }

    } else {
      res.status(400).send(e);
    }



  });
}

//loginUser: This method is responsible for logging in a user and returning a token
//He has to provide a valid email and password
module.exports.loginUser = async (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  if (!body.email) {
    return res.status(400).send();
  }

  if (!body.password) {
    return res.status(400).send();
  }

  User.findByCredentials(body.email, body.password).then((user) => {
    if (!user) {
      return res.status(404).send();
    }
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({ user });
    });
  }).catch((e) => {
    if (e.message === 'email not found') {
      res.status(404).send({ msg: e.message });
    }
    if (e.message === 'password not correct') {
      res.status(404).send({ msg: e.message });
    } else {
      res.status(500).send();
    }
  });
};

//editPassword: This method is responsible for editing any information about a user except password.
//He has to provide the field he wants to edit with the new value
module.exports.editProfile = async (req, res) => {
  var id = req.user._id;
  var user = {};
  user.profile = req.user.profile
  if (req.body.user && req.body.user.profile) {
      if ( (req.body.user.profile.fullName && req.body.user.profile.fullName.length >=6) || req.body.user.profile.description || req.body.user.profile.achievements) {
        user.profile = _.merge(req.user.profile, req.body.user.profile);
      }
      else if ( (req.body.user.profile.fullName && req.body.user.profile.fullName.length <6) || req.body.user.profile.description || req.body.user.profile.achievements) {
        return res.status(400).send({
          errMsg: "Name can not be less than 6 characters"
        });
      }
      else if (req.body.user.profile.interests && _.isArray(req.body.user.profile.interests)) {
        user.profile.interests = req.body.user.profile.interests;
      }
      else if (req.body.user.profile.expertIn && _.isArray(req.body.user.profile.expertIn)) {
        user.profile.expertIn = req.body.user.profile.expertIn;
      }

      User.findByIdAndUpdate(id, { $set: user }, { new: true }).then((updatedUser) => {
        if (!updatedUser) {
          return res.status(404).send();
        }
        res.send({ updatedUser });
      }).catch((e) => {
        res.status(500).send();
      })

  }

}

//changePassword: This method is responsible for changing the password of the user
//He has to provide the CORRECT old password and his new password which has to be min of 6 letters
module.exports.changePassword = async (req, res) => {
  if (req.body.user && req.body.user.oldPassword && req.body.user.newPassword) {
    User.findByCredentials(req.user.email, req.body.user.oldPassword).then((user) => {
      user.password = req.body.user.newPassword;
      user.save().then((updatedUser) => {
        res.send({ updatedUser });
      }).catch((err) => {
        res.status(500).send();
      });
    }).catch((err) => {
      res.status(400).send({
        errMsg: "IncorrectPassword"
      });
    });
  } else {
    res.status(400).send({
      errMsg: "Incomplete information"
    });
  }

}

//logout: This method is responsible for logging out the user.
//He has to provide his token and it will be removed so he will be logged out
module.exports.logout = async (req, res) => {
  User.findByToken(req.token).then((user) => {
    user.tokens = _.remove(user.tokens, (currentToken) => {
      return currentToken.token !== req.token;
    });
    user.save();
    res.send();

  }).catch((err) => {
    res.status(500).send();
  });
}

//searchByName: This method is responsible for searching for a user by his name
//He has to provide a string and the users who have a full Name which CONTAINS this string will be returned
module.exports.searchByName = async (req, res) => {

  var query = mongoose.model('User').find({
    _id: {
      $ne: req.user._id
    },
    "profile.fullName": {
      '$regex': req.body.name, '$options': 'i'
    }
  });

  query.select("profile.fullName _id");

  query.exec(function (error, result) {
    if (error) {
      res.status(500).send(error);
    }
    else {
      if (result.length != 0) {
        res.status(200).send({ result });
      }
      else {
        res.status(200).send({ result });
      }
    }

  });
}

//getUserById: This method is responsible for getting a user based on his ID
//He has to provide the id and the user who has this id will be returned
module.exports.getUserByID = async (req, res) => {

  var query = mongoose.model('User').find({ "_id": req.params.id });

  query.select("email roles profile.fullName profile.description profile.rating profile.interests profile.expertIn profile.achievements");

  query.exec(function (error, user) {
    if (error) {
      res.status(500).send(error);
    }
    else {
      if (user.length != 0) {
        res.status(200).send({ user: user[0] });
      }
      else {
        res.status(404).send();
      }
    }

  });
}

//getUserByToken: This method is responsible for getting a user based on his tokens
//He has to provice a token and the user who has this token will be returned
module.exports.getUserByToken = async (req, res) => {
  var token = req.header('x-auth');

  var user = await User.findOne({
    'tokens.token': token
  });

  if (User) {
    res.status(200).send({ user });
  }
  else {
    res.status(404).send();
  }
}
