const express = require("express");
const userRouter = express.Router();
const { validateSignup, registerSignupValidator } = require("../helpers/validation");
const passport = require("passport");
const { editUser } = require("../controllers/userController");

userRouter.put("/:id", passport.authenticate("jwt", {session: false}), editUser);

module.exports = userRouter;