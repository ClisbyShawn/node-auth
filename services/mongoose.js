const mongoose = require("mongoose");
const keys = require("../config/keys");

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongooseDB..."))
  .catch((err) => console.log("Could not connect to MongoDB", err));
