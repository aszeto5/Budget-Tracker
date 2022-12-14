require('dotenv').config()

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/budget-app";

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    // useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.log(err);
    else console.log("mongodb running");
  }
);
console.log("Connecting to MONgo");
// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}! http://localhost:${PORT}`);
});