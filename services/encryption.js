const bcrypt = require("bcrypt");

encryptPassword = async (requestedPassword) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(requestedPassword, salt);
};

decryptPassword = async (requestPassword, databasePassword) => {
  return await bcrypt.compare(requestPassword, databasePassword);
};

module.exports = {
  encryptPassword,
  decryptPassword,
};
