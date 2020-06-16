const { model, Schema } = require("mongoose");
const { compareSync } = require("bcrypt");

const { hashPassword } = require("../utils/password");

const usersSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

usersSchema.pre("save", function(next) {
  if (this.isModified("password") && this.isNew) {
    try {
      this.password = hashPassword(this.password);
      next();
    } catch (e) {
      next(e);
    }
  } else {
    next();
  }
});

usersSchema.methods.isValidPassword = function(password) {
  return compareSync(password, this.password);
};

module.exports = model("users", usersSchema);
