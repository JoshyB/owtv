const mongoose = require("mongoose");
const Messages = require("../models/messageModel");
const TwitchTV = require("../models/twitchChannelModel.js");

module.exports = io => {
  const users = [];

  function checkForDups(user) {
    // if a single person logs in, the initial state of the array is empty, therefore the for loop below
    // will not fire and no user will be pushed to the array, so there would be no users visible in the user pane client side
    // as the array is emited to the client and then state is updated with a list of logged in users.
    // this if statement checks to see if the array is empty--meaning no one is logged in. If it is, push a user into [users]
    if (users.length === 0) {
      users.push(user);
    }
    //loop through [users] and check for duplicate names and IDs so a single user isn't added multiple times
    for (let i = 0; i < users.length; i++) {
      //make sure the ID or username isn't present in [users]
      if (
        users[i].socketId === user.socketId ||
        users[i].username === user.username
      ) {
        //if the user is already logged in, halt!
        return;
      } else {
        //if there is no such user present, push them into the array and break the loop
        users.push(user);
        break;
      }
    }
  }

  function removeUserFromArray(socketId) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].socketId === socketId) {
        users.splice(i, 1);
      }
    }
  }

  io.path("/");
  io.on("connection", async socket => {
    //get chat messages from databse and send them to client
    Messages.find({}, (err, res) => {
      socket.emit("getChatMessages", res);
    });

    TwitchTV.findOne({}, (err, res) => {
      if (err) return;
      socket.emit("getTwitchStream", res);
    });

    socket.on("addUserOnConnect", userToBeAdded => {
      const { username, socketId } = userToBeAdded;
      const user = {
        socketId,
        username
      };
      //checkForDups checks to see if the user is already present in [users] before it gets pushed to the array
      checkForDups(user);
      io.sockets.emit("addUsersToListOnConnect", users);
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

    socket.on("disconnect", async () => {
      await removeUserFromArray(socket.id);
      io.sockets.emit("updateListOfUsersOnDisconnect", users);
    });
  });
};
