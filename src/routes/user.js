const express = require("express");
const userRouter = express.Router();
const { validateSignup, registerSignupValidator } = require("../helpers/validation");
const passport = require("passport");
const { editUser, getUser } = require("../controllers/userController");

userRouter.put("/:id", passport.authenticate("jwt", {session: false}), editUser);
userRouter.get("/:id", passport.authenticate("jwt", {session: false}), getUser);

module.exports = userRouter;