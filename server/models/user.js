const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
var validate = require('mongoose-validator');
const uniqueValidator = require('mongoose-unique-validator');

var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'not a valid email',
  })
];



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
  roles:{
    type: [String],
    default: ['user']
  },
  profile: {
    fullName: {
      type: String,
      minlength: 2
    },
    description: {
      type: String,
      default: ''
    },
    interests: [String], //array of tags
    achievements: {
      type:String,
      default: ''
    },
    expertIn: [String],  //array of tags
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

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();


  user.tokens.unshift({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {


    return new Promise((resolve, reject) => {
      if (!user) {
        reject(new Error('email not found'));
      }
      // Use bcrypt.compare to compare password and user.password
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

UserSchema.methods.removeToken = function(token){
  var user = this;

  return user.update({
      $pull : {
          tokens : {
              token
          }
      }
  });
}

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
