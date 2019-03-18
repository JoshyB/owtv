const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: "Please provide a Username"
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: "Please provide an email"
    },
    password: {
      type: String,
      required: "Please provide a password"
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

module.exports = mongoose.model("User", userSchema);
