const mongoose = require("mongoose");
const Messages = require("../models/messageModel.js");

exports.addChatMessage = async (req, res, next) => {
  const { userID, username, message } = req.body;
  await Messages({
    userID,
    username,
    message
  }).save(err => {
    if (err) {
      return;
    } else {
      return res.status(200).send("message was added to the DB 💩");
    }
  });
};
