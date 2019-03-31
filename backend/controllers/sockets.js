const mongoose = require("mongoose");
const Messages = require("../models/messageModel");
const TwitchTV = require("../models/twitchChannelModel.js");

module.exports = io => {
  io.path("/");
  io.on("connection", socket => {
    console.log(socket.id);
    //get chat messages from databse and send them to client
    Messages.find({}, (err, res) => {
      socket.emit("getChatMessages", res);
    });

    TwitchTV.findOne({}, (err, res) => {
      if (err) return;
      socket.emit("getTwitchStream", res);
    });

    socket.on("chatMessage", messageBody => {
      const { userID, username, message } = messageBody;
      Messages({
        userID,
        username,
        message
      }).save(err => {
        if (err) return;
      });
      io.sockets.emit("addChatMessage", { userID, username, message });
    });

    socket.on("changeTwitchFeed", twitchFeed => {
      const { twitchFeedURL, streamersName } = twitchFeed;
      TwitchTV({
        twitchFeedURL,
        streamersName
      }).save(err => {
        if (err) return;
      });
      io.sockets.emit("newTwitchFeed", twitchFeed);
    });
  });
};
