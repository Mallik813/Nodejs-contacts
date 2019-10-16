const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var contactSchema = new Schema({  
  name:  {                               //getting name
      type: String,
      required: true
  },
  phone: {                               //getting phone number
    type: String,
    minlength: 10,
    maxlength: 10,
    required: true
  },
  email:{                                //getting email ID
    type: String,
    required: false
  }

});
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  contacts:[contactSchema]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;                                        // Exporting module to user
