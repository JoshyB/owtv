const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../../shared/handlers/auth");

//generate a hashed password with bcrypt for DB storage
generateEncrytPassword = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

//compare passwords when user logs in.
comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash);
};

// handle the JWT process
createJSONWebToken = user => {
  return jwt.sign({ user }, process.env.JWT_SECRET);
};

exports.registerUser = async (req, res, next) => {
  // deconstructing user fields.
  const { username, email } = req.body;

  const password = await generateEncrytPassword(req.body.password);

  const user = await new User({
    email,
    username,
    password
  }).save(err => {
    if (err) return res.status(400).send(`unable to save to database: ${err}`);
    next();
  });
};

exports.userLogin = async (req, res) => {
  const { email } = req.body;
  await User.findOne({ email: email }, (err, result) => {
    if (err) {
      res.send(err);
    }
    if (result) {
      const user = {
        username: result.username,
        userID: result._id,
        admin: result.admin
      };
      const token = createJSONWebToken(user);
      res.json({ token: token });
    } else {
      res.send("An error occured");
    }
  });
};

exports.redirectJoshua = (req, res) => {
  res.redirect("/");
};
