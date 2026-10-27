const express = require("express");
const postRouter = express.Router();
const { validateSignup, registerSignupValidator } = require("../helpers/validation");
const passport = require("passport");
const { createPost, editPost } = require("../controllers/postController");


postRouter.post("/", passport.authenticate("jwt", {session: false}), createPost);
postRouter.put("/:id", passport.authenticate("jwt", {session: false}), editPost);


module.exports = postRouter;