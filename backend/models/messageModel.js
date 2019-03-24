const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    userID: {
      type: String,
      trim: true
    },
    username: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true
    }
  },
  {
    capped: { size: 250, max: 250 },
    timestamps: true
  }
);

module.exports = mongoose.model("Messages", messageSchema, "Messages");
