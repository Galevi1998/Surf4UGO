const mongoose = require("mongoose");
const internal = require("stream");

const uri =
  "mongodb+srv://ori:ori123@myshop.uhdnmyx.mongodb.net/myshopdatabase?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongoose connected");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error);
  });

const logInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required : true,
  },
  permission :{
    type : Number,
    required : true,
  },
});

const LogInCollection = mongoose.model("accounts", logInSchema);

module.exports = LogInCollection;
