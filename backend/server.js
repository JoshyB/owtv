require("dotenv").config();

//packages
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const Bundler = require("parcel-bundler");
const mongoose = require("mongoose");
const Path = require("path");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
//pulls in various sockets used for the chat app
require("./controllers/sockets")(io);

// set up connection to databse
const db = mongoose.connection;
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });
db.on("error", () => {
  err => console.log(`⛔⛔ ${err} ⛔⛔`);
});
db.once("open", () => {
  console.log("👍👍👍 We are connected to the Database 👍👍👍");
});

const entry = Path.join(__dirname, "../src/index.html");

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//handle our routes
app.use("/", routes);

const bundleOptions = {
  outdir: "./dist",
  outFile: "index.html"
};
const bundler = new Bundler(entry, bundleOptions);

app.use(bundler.middleware());

//pop the port number into a variable for use
const port = process.env.PORT || 7777;

server.listen(port, () => {
  console.log(`Server is running on ${port} 🚀🚀`);
});
