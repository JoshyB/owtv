const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const twitchChannel = new Schema(
  {
    twitchFeedURL: {
      type: String,
      trim: true
    },
    streamersName: {
      type: String,
      trim: true
    }
  },
  {
    capped: { size: 1, max: 1 },
    timestamps: true
  }
);
module.exports = mongoose.model("TwitchTV", twitchChannel, "TwitchTV");
