const { genSaltSync, hashSync } = require("bcrypt");

const hashPassword = password => {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return hash;
};

module.exports = {
  hashPassword
};
