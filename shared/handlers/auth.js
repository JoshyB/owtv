const User = require("../../backend/models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.verifyToken = token => {
  return jwt.verify(token, process.env.JWT.SECRET, (err, result) => {
    if (err) {
      console.log(err);
    }
    return result;
  });
};

exports.checkIfUserExists = async (req, res, next) => {
  const { email } = req.body;

  await User.findOne({ email: email }, (err, result) => {
    //check for errors
    if (err) {
      res.send(err);
    }
    if (result) {
      //if the user is alreay in the database then halt registration and let them know
      res.status(433).send([
        {
          message: "Sorry that Email already exists 😢"
        }
      ]);
    } else {
      //onward!!!!
      next();
    }
  });
};

exports.validateUser = async (req, res, next) => {
  // 1. look up the user by the provided email
  const { email, password } = req.body;

  await User.findOne({ email: email }, (err, result) => {
    if (err) {
      res.send(err);
    }
    // 2. if the user exists, get the hashed password from the database
    if (result) {
      // 3. compare the password using the bcrypt.compare method to check to see if the password is valid
      bcrypt.compare(password, result.password).then(result => {
        if (result === true) {
          // if the user is valid...keep trucking
          next();
        } else {
          // if the login is NOT valid send the user some feedback to the frontend login component
          res
            .status(422)
            .send([{ message: "Username or password is incorrect. 😢" }]);
        }
      });
    } else {
      // if the user DOES NOT exists send an error message to the frontend login component
      res.status(422).send([
        {
          message: "That user doesn't exists. 😢"
        }
      ]);
    }
  });
};
