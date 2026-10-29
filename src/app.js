const express = require("express");
const app = express();
const cors = require('cors');
const port = 3000;
const authRouter = require("./routes/auth");
const passport = require("passport");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
//require("dotenv").config();

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middlware to allow cross origin requests
app.use(cors({ origin: ["http://localhost:5173"] }));
require("./config/passport")(passport);
app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);


// default error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something broke!');
});


module.exports = app;