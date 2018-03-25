var mongoose = require('mongoose');

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
  roles: [String],
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
    acievements: {
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
  }

});
mongoose.model('User', UserSchema);
