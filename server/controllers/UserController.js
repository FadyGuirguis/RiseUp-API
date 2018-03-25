const mongoose = require('mongoose');
const _ = require('lodash');
  moment = require('moment'),
  User = mongoose.model('User');

module.exports.createUser = async (req, res)=>{
  console.log('test');
  var body = _.pick(req.body, ['username', 'password', 'email']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();

  }).then((token) => {
    res.header('x-auth', token).send({data:user});
  }).catch((e) => {
    console.log(e);
    res.status(400).send(e);
  });
}

module.exports.loginUser = async (req, res) => {
  var body = _.pick(req.body, ['username', 'password', 'email']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      console.log("logged in");
      res.header('x-auth', token).send({data:user});
    });
  }).catch((e) => {
    console.log(body);
    res.status(400).send();
  });
};

module.exports.deleteUser = async (req,res)=>{
  req.user.removeToken(req.token).then(()=>{
      res.status(200).send();
  },()=>{
      res.status(400).send();
  });
};
