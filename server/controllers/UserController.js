const mongoose = require('mongoose');
const _ = require('lodash');
  moment = require('moment'),
  User = mongoose.model('User');

module.exports.createUser = async (req, res)=>{
  console.log('test');
  var body = _.pick(req.body.user, ['email', 'password']);
  body.profile = {};
  body.profile.fullName = req.body.user.profile.fullName;
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();

  }).then((token) => {
    res.header('x-auth', token).send({user});
  }).catch((e) => {
    res.status(500).send(e);
  });
}

module.exports.loginUser = async (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

 

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      console.log("logged in");
      res.header('x-auth', token).send({user});
    });
  }).catch((e) => {
    res.status(500).send();
  });
};

module.exports.editMyFullName = async (req, res) => {

  if(!req.body.profile.fullName)
    res.status(400).send({ msg: 'No name is provided.' });

  var thisUser = req.user;

  thisUser.profile.fullName = req.body.profile.fullName;

  thisUser.save().then((updatedUser) => {
    res.send({ updatedUser });
  }).catch((err) => {
    res.status(500).send({ error: err });
  });

};

// module.export.editProfile = async (req, res) => {
//   var user;
//   var id;
//   var edited;
//   if(req.body.user) {
//       user = req.user;
//       id = req.user._id;
//     if(req.body.user.profile) {
//       if(req.body.user.profile.fullName) {
//         user.profile.fullName = req.body.user.profile.fullName;
//         edited = user.profile.fullName;
//       }
//       else if (req.body.user.profile.description) {
//         user.profile.description = req.body.user.profile.description;
//         edited = user.profile.description;
//       }
//       else if (req.body.user.profile.interests) {
//           user.profile.interests = req.body.user.profile.interests;
//           edited = user.profile.interests;
//       }
//       else if (req.body.user.profile.expertIn) {
//         user.profile.expertIn = req.body.user.profile.expertIn;
//         edited = user.profile.expertIn;
//       }
//     }
//   }
//
//   user.findByIdAndUpdate(id, {$set: edited}, {new: true}).then((updatedUser) => {
//     if(!updatedUser) {
//       return res.status(404).send();
//     }
//     res.send({updatedUser});
//   }).catch((e) => {
//     res.status(500).send();
//   })
//   }

module.exports.editProfile = async (req, res) => {
 var id = req.user._id;
 var user = {};
 user.profile = req.user.profile
  if(req.body.user && req.body.user.profile) {
    if (req.body.user.profile.fullName || req.body.user.profile.description || req.body.user.profile.achievements) {
        user.profile = _.merge(req.user.profile, req.body.user.profile);
    } else if (req.body.user.profile.interests && _.isArray(req.body.user.profile.interests)) {
      user.profile.interests = req.body.user.profile.interests;
    }

}
  User.findByIdAndUpdate(id, {$set:  user }, {new: true}).then((updatedUser) => {
    if(!updatedUser) {
      return res.status(404).send();
    }
    res.send({updatedUser});
  }).catch((e) => {
    res.status(500).send();
  })
  }
