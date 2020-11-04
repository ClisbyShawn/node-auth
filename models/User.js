const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

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

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      id: this._id,
    },
    keys.jwtKey,
    {
      expiresIn: "30d",
    }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateNew(user) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "edu", "org"] },
      })
      .required(),
    password: Joi.string().min(5).max(12).required(),
  });
  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "edu", "org"] },
      })
      .required(),
    password: Joi.string().min(5).max(12).required(),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validateNew = validateNew;
module.exports.validateLogin = validateLogin;
