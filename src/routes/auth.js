const express = require("express");
const authRouter = express.Router();
const { signup, login } = require("../controllers/authController")
const { validate, registerSignupValidator } = require("../helpers/validation");
const passport = require("passport");

authRouter.post("/signup", registerSignupValidator, validate, signup);
authRouter.post("/login", registerSignupValidator, validate, login);

authRouter.get("/protected", passport.authenticate("jwt", {session: false}), (req, res) => {
  return res.status(200).json({user: req.user});
});

module.exports = authRouter;