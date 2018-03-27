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

  var newName = req.body.profile.fullName;
  var thisUser = req.user;

  thisUser.profile.fullName = newName;

  thisUser.save().then((updatedUser) => {
    res.send({ updatedUser });
  }).catch((err) => {
    res.status(500).send({ error: err });
  });

};