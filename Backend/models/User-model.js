const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  Revenue: {
    type: Number,
    default: 0,
  },
  //   datasheetRef: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "RecyclableDataSheet",
  //     required: true,
  //   },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
