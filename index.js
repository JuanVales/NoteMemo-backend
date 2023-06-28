require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
require("./config/Passport");
const PORT = process.env.PORT || 3001;
const frontEndSv = "https://leafy-squirrel-2117af.netlify.app";

const app = express();

app.use(
  cors({
    origin: frontEndSv,
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // do this when implementing
    //cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const mongo_user = process.env.MONGO_DB_USERNAME;
const mongo_password = process.env.MONGO_DB_PASSWORD;

mongoose.connect(
  "mongodb+srv://" +
    mongo_user +
    ":" +
    mongo_password +
    "@cluster0.n4kzdvo.mongodb.net/NoteApp"
);

// Register the imported routers
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

app.listen(PORT, () => {
  console.log("Server started in port 3001");
});

/* const crypto = require("crypto");

const generateSessionSecret = () => {
  return crypto.randomBytes(32).toString("hex");
};

console.log(generateSessionSecret()); */
