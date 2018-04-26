/*H

FILENAME: user.js

DESCRIPTION: This is the javascript file for the UserController,
             its main functionality is defining the user model and some helper methods
             
FUNCTIONS:  
           generateAuthToken
           findByCredentials
           removeToken
           findByToken

AUTHOR: Daniel Achraf & Fady Sameh        START DATE: 3 Apr 2018.

H*/

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var validate = require('mongoose-validator');
const uniqueValidator = require('mongoose-unique-validator');

//emailValidator: This is used to define the error message that is returned to the user
//if he submitted an invalid email format
var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'not a valid email',
  })
];


//UserSchema: This is used to define the schema of the user and it is pretty descriptive
const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: 'Email is already taken',
    validate: emailValidator

  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  roles: {
    type: [String],
    default: ['user']
  },
  profile: {
    fullName: {
      type: String,
      minlength: 6
    },
    description: {
      type: String,
      default: ''
    },
    interests: [String],
    achievements: {
      type: String,
      default: ''
    },
    expertIn: [String],
    rating: {
      rating: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]

});

UserSchema.plugin(beautifyUnique);


//generateAuthToken: this method is responsivle for generating the token using his id
// and a 6bit salt
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();


  user.tokens.unshift({ access, token });

  return user.save().then(() => {
    return token;
  });
};

//findByCredentials: This method is responsible for returning a user when provided 
//an email and a password
UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({ email }).then((user) => {


    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('email not found'));
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject(new Error("password not correct"));
        }
      });
    });
  });
};

//removeToken: This method is responsible for deleting a token from the user's token array
UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
}

//findByToken: This method is responsible for finding a user based on a taken.
// If provided a token, the user what will have this token in his tokens array will be returned
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

//presave: This method is responsible for hashing the password before saving him.
UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

module.exports.User = mongoose.model('User', UserSchema);
