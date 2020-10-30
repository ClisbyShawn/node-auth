const mongoose = require("mongoose");
const Joi = require("joi");

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

function validate(user) {
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

module.exports.User = User;
module.exports.validate = validate;
