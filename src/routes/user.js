const express = require("express");
const userRouter = express.Router();
const { validate, registerEditUserValidator} = require("../helpers/validation");
const passport = require("passport");
const { editUser, getUser, getUsers, delUser, followUser, getFollowers, unfollowUser, getFollowing, checkFollow, searchUser} = require("../controllers/userController");

userRouter.get("/all", passport.authenticate("jwt", {session: false}), getUsers);
userRouter.get("/", passport.authenticate("jwt", {session: false}), searchUser);
userRouter.put("/:id/follow", passport.authenticate("jwt", {session: false}), followUser);
userRouter.get("/:id/checkFollow", passport.authenticate("jwt", {session: false}), checkFollow);
userRouter.put("/:id/unfollow", passport.authenticate("jwt", {session: false}), unfollowUser);
userRouter.get("/:id/followers", passport.authenticate("jwt", {session: false}), getFollowers);
userRouter.get("/:id/following", passport.authenticate("jwt", {session: false}), getFollowing);
userRouter.put("/:id", passport.authenticate("jwt", {session: false}), registerEditUserValidator, validate, editUser);
userRouter.get("/:id", passport.authenticate("jwt", {session: false}), getUser);
userRouter.delete("/:id", passport.authenticate("jwt", {session: false}), delUser);

module.exports = userRouter;