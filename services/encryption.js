const bcrypt = require("bcrypt");

hashedPassword = async (requestedPassword) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(requestedPassword, salt);
};

module.exports = {
  hashedPassword,
};
