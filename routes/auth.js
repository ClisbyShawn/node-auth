const router = require("express").Router();
const _ = require("lodash");
const { User, validateNew, validateLogin } = require("../models/User");
const auth = require("../middleware/auth");
const errorService = require("../services/errors");
const { encryptPassword, decryptPassword } = require("../services/encryption");

router.post("/register", async (req, res) => {
  const user = req.body;

  const { error } = validateNew(user);
  if (error)
    return res.send(
      errorService(400, "Malformed Request", error.details[0].message)
    );

  let exsistingUser = await User.findOne({
    email: user.email,
  });

  if (exsistingUser)
    return res.send(
      errorService(
        409,
        "Exsisting Email",
        `${user.email} already exsists in our systems.`
      )
    );

  const password = await encryptPassword(user.password);

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
    return res.send(
      errorService(400, "Malformed Request", error.details[0].message)
    );

  const dbUser = await User.findOne({ email: user.email });
  if (!dbUser)
    return res.send(
      errorService(400, "Incorrect Credentials", "Invalid email/password.")
    );

  const isMatchingPassword = await decryptPassword(
    user.password,
    dbUser.password
  );

  if (!isMatchingPassword)
    return res.send(
      errorService(400, "Incorrect Credentials", "Invalid email/password.")
    );

  res.status(200).send(dbUser.generateAuthToken());
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password -__v");
  res.status(200).send(user);
});

module.exports = router;
