const express = require("express");
const userRouter = express.Router();
const { validateSignup, registerSignupValidator } = require("../helpers/validation");
const passport = require("passport");
const { editUser, getUser, getUsers, delUser, followUser, getFollowers, unfollowUser, getFollowing} = require("../controllers/userController");

userRouter.get("/all", passport.authenticate("jwt", {session: false}), getUsers);
userRouter.put("/:id/follow", passport.authenticate("jwt", {session: false}), followUser);
userRouter.put("/:id/unfollow", passport.authenticate("jwt", {session: false}), unfollowUser);
userRouter.get("/:id/followers", passport.authenticate("jwt", {session: false}), getFollowers);
userRouter.get("/:id/following", passport.authenticate("jwt", {session: false}), getFollowing);
userRouter.put("/:id", passport.authenticate("jwt", {session: false}), editUser);
userRouter.get("/:id", passport.authenticate("jwt", {session: false}), getUser);
userRouter.delete("/:id", passport.authenticate("jwt", {session: false}), delUser);

module.exports = userRouter;