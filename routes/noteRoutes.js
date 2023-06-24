const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/getNotes", (req, res) => {
  console.log(req.isAuthenticated() + " REQ AUTHENTICATED?");
  if (req.isAuthenticated()) {
    User.findById(req.user.id)
      .then((result) => {
        res.json(result.notes);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    console.log("triggered");
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.post("/createNote", async (req, res) => {
  const id = req.user._id;
  const note = req.body;
  if (req.isAuthenticated()) {
    console.log(req.user);

    try {
      const updatedNote = await User.findByIdAndUpdate(id, {
        $push: { notes: note },
      });
      if (!updatedNote) {
        console.log("Couldn't update user's notes");
      } else {
        console.log("Note added to user's notes");
      }
    } catch (error) {
      console.error(error);
    }
  }
});

router.delete("/deleteNote/:id", async (req, res) => {
  const noteId = req.params.id;
  const userId = req.user._id;

  try {
    const deletedNote = await User.findByIdAndUpdate(userId, {
      $pull: { notes: { id: noteId } },
    });
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    } else {
      res.json({ message: "Note deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
