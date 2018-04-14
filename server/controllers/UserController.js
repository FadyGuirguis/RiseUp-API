const mongoose = require('mongoose');
const _ = require('lodash');
moment = require('moment'),
User = mongoose.model('User');

module.exports.createUser = async (req, res)=>{  //zabat el error messages, from MODEL nafso

  try{
    var body = _.pick(req.body.user, ['email', 'password']);
    body.profile = {};
    body.profile.fullName = req.body.user.profile.fullName;
  }catch(error){
    res.status(400).send('Please enter an email or password');
  }

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
    if (!user) {
      return res.status(404).send();
    }
    return user.generateAuthToken().then((token) => {
      console.log("logged in");
      res.header('x-auth', token).send({user});
    });
  }).catch((e) => {
    res.status(500).send();
  });
};

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
    else if (req.body.user.profile.expertIn && _.isArray(req.body.user.profile.expertIn)) {
    user.profile.expertIn = req.body.user.profile.expertIn;
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

module.exports.changePassword = async (req, res) => {
  if (req.body.user && req.body.user.oldPassword && req.body.user.newPassword) {
    User.findByCredentials(req.user.email, req.body.user.oldPassword).then((user) => {
      user.password = req.body.user.newPassword;
      user.save().then((updatedUser) => {
        res.send({updatedUser});
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




//search users by name,
//msh exact name, like!,
//example: there's Daniel Ashraf and Daniel Erian in the database,
//I search for Daniel, yegeeli Daniel Ashraf w Daniel Erian

//db.getCollection('users').find({"profile.fullName": {'$regex': 'tEst', '$options': 'i'}})


  module.exports.searchByName = async (req, res) => {   //ALL
    console.log(req.body.name);

    var query = mongoose.model('User').find({
      _id: {
      $ne: req.user._id
      },
      "profile.fullName": {
      '$regex': req.body.name, '$options': 'i'
      }
    });

    query.select("profile.fullName _id");

       query.exec(function(error, result){
        if (error){
          res.status(500).send(error); //something wrong happended
        }
        else{
          if(result.length != 0){ //found an item
              res.status(200).send({result});
          }
          else {
              res.status(200).send({result});
          }
        }

      });
  }

  ///user/:id
  module.exports.getUserByID = async (req, res) => {
    console.log(req.params.id);

     var query = mongoose.model('User').find({"_id":  req.params.id});

     //select what you want, seperate by white space
      query.select("email roles profile.fullName profile.description profile.rating profile.interests profile.expertIn profile.achievements");

        query.exec(function(error, user){
         if (error){
           res.status(500).send(error); //something wrong happended
         }
         else{
           if(user.length != 0){ //found an item
               res.status(200).send({user: user[0]});
           }
           else {
               res.status(404).send();
           }
         }

       });
  }
