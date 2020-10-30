const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  meta_data: {
    joined: {
      type: Date,
      default: Date(),
    },
  },
});

const User = mongoose.model("User", userSchema);

module.exports.User = User;
