const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const Notes = require("./Note");

const userSchema = new Schema({
  name: String,
  username: { type: String /* , unique: true  */ },
  email: String,
  salt: String,
  hash: String,
  googleId: String,
  notes: [Notes.schema],
});

userSchema.plugin(passportLocalMongoose /* , { usernameField: "username" } */);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

module.exports = User;
