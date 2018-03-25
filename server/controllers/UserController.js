const _ = require('lodash');
const mongoose = require('mongoose');
User = mongoose.model('User');

//POST /register
module.exports.register = async (req, res) => {

  //check if email is already in use
  User.findOne({email: req.body.email}).then((todo) => {
    if (todo) {
      return res.status(400).send({
        message: "email already in use"
      });
    }
  });

  var user = new User(_.pick(req.body, ['email', 'password']));
  user.save()
  .then(() => {
    res.send({
      user
    });
  })
  .catch((err) => {
    res.status(400).send();
  });
};

//POST /login
module.exports.login = async (req, res) => {
  User.findOne({email: req.body.email}).then((user) => {
    if (!user) {
      return res.status(404).send({
        message: 'Email not found'
      });
    }
    (user.password === req.body.password) ? res.send({user})
    : res.status(400).send({message: 'Incorrect password'});

  }).catch((err) => {
    res.status(400).send();
  })
};
