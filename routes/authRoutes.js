require("dotenv").config();
const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");
const { frontEndServer } = require("../config/config");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/notememo",
  passport.authenticate("google", {
    failureRedirect: frontEndServer,
  }),
  function (req, res) {
    res.redirect(frontEndServer);
  }
);

router.post("/login", async function (req, res, next) {
  console.log("Login route triggered");
  User.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      // User not registered
      return res.status(401).json({ message: "User not registered." });
    }

    passport.authenticate("local", function (err, user, info) {
      if (err) {
        // Error during authentication
        return next(err);
      }

      if (!user) {
        // Invalid credentials
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Successful login
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        console.log("Login succssesfull");
        return res.status(200).json({ user });
      });
    })(req, res, next);
  });
});

router.post("/register", async function (req, res, next) {
  const { username, name, password, email } = req.body;
  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        // hacer error en el front end para este caso
        console.log("User already registered.");
        res.status(409).json({ message: "User already registered." });
      } else if (!user) {
        const newUser = new User({ username, name, email });
        User.register(newUser, password, (err, user) => {
          if (err) {
            // Handle registration error
            console.log("Failed to register user. 1");
            console.log(err);
            res.status(500).json({ message: "Failed to register user." });
          } else {
            // Registration successful
            console.log(
              "Registration successful" + passport.authenticate("local")
            );
            passport.authenticate("local")(req, res, () => {
              const redirectUrl = frontEndServer;
              res.status(200).json({ redirectUrl });
            });
          }
        });
      }
    })
    .catch((err) => {
      // hacer error en el front end para este caso
      console.log("Unexpected error occurred.");
      console.error(err);
      res.status(500).json({ message: "Unexpected error occurred." });
    });
});

router.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.isAuthenticated() + " user authenticated?");
    User.findById(req.user.id)
      .then((result) => {
        /* console.log(result + "this is result"); */
        res
          .status(200)
          .json({ message: "User is athenticated", name: result.name });
        console.log(result.name);
      })
      .catch((err) => {
        console.error(err);
      });
  } else {
    // hacer error en el front end para este caso redirect to home
    res.status(401).json({ message: "User is not athenticated" });
  }
});

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect(frontEndServer);
});

module.exports = router;
