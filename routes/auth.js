const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/User");

//Register New User
router.post("/register", async (req, res) => {
  const user = req.body;
  const { error } = validate(user);
  if (error) return res.status(400).send(error.details[0].message);

  //encrypt password
  const salt = await bcrypt.genSalt(12);
  const password = await bcrypt.hash(user.password, salt);

  const newUser = await new User({
    name: user.name,
    email: user.email,
    password,
  }).save();

  res.send(_.pick(newUser, ["_id", "name", "email", "meta_data"]));
});

//Login User

//Get User

module.exports = router;
