const express = require("express");
const router = express.Router();

//controllers
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");
//bringing in validators for registration
const { validateRegistration } = require("../../shared/handlers/validators");

const {
  checkIfUserExists,
  validateUser
} = require("../../shared/handlers/auth");

// 1. post to the registerUser route
// 2. check to see if the user already exists
// 3. validate user data
// 4. register the user
router.post(
  "/api/registerUser",
  checkIfUserExists,
  validateRegistration,
  userController.registerUser,
  userController.userLogin
);

router.post("/api/userLogin", validateUser, userController.userLogin);

module.exports = router;
