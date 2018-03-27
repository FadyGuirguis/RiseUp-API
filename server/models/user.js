const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique : true
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  roles:{
    type: [String],
    default: ['user']
  },
  profile: {
    fullName: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    interests: [{tag:String}],
    achievements: {
      type:String,
      default: ''
    },
    expertIn: [{tag:String}],
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

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();


  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {
    if (!user) {
                      console.log('heeeere');
      return Promise.reject();
    }


    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
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

mongoose.model('User', UserSchema);
