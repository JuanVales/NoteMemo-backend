const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  id: String,
  title: String,
  content: String,
  date: String,
});

const Notes = mongoose.model("Notes", notesSchema);

module.exports = Notes;
