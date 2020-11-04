const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validateNew, validateLogin } = require("../models/User");
const auth = require("../middleware/auth");
const errorService = require("../services/errors");

router.post("/register", async (req, res) => {
  const user = req.body;

  const { error } = validateNew(user);
  if (error)
    return res
      .status(400)
      .send(errorService("Malformed Request", error.details[0].message));

  let exsistingUser = await User.findOne({
    email: user.email,
  });

  if (exsistingUser)
    return res
      .status(409)
      .send(
        errorService(
          "Exsisting Email",
          `${user.email} already exsists in our systems.`
        )
      );

  const salt = await bcrypt.genSalt(12);
  const password = await bcrypt.hash(user.password, salt);

  const newUser = await new User({
    name: user.name,
    email: user.email,
    password,
  }).save();

  const token = newUser.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(newUser, ["_id", "name", "email", "meta_data"]));
});

router.post("/login", async (req, res) => {
  const user = req.body;
  const { error } = validateLogin(user);
  if (error)
    return res
      .status(400)
      .send(errorService("Malformed Request", error.details[0].message));

  const currentUser = await User.findOne({ email: user.email });
  if (!currentUser)
    return res
      .status(400)
      .send(errorService("Incorrect Credentials", "Invalid email/password."));

  const isMatchingPassword = await bcrypt.compare(
    user.password,
    currentUser.password
  );
  if (!isMatchingPassword)
    return res
      .status(200)
      .send(errorService("Incorrect Credentials", "Invalid email/password."));

  res.status(200).send(currentUser.generateAuthToken());
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -__v");
  res.status(200).send(user);
});

module.exports = router;
