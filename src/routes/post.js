const express = require("express");
const postRouter = express.Router();
const { validate, createPostValidator } = require("../helpers/validation");
const passport = require("passport");
const { createPost, editPost, getPost, getPosts, deletePost } = require("../controllers/postController");

postRouter.post("/", passport.authenticate("jwt", {session: false}), createPostValidator, validate, createPost);
postRouter.get("/all", passport.authenticate("jwt", {session: false}), getPosts);
postRouter.put("/:id", passport.authenticate("jwt", {session: false}), createPostValidator, validate, editPost);
postRouter.get("/:id", passport.authenticate("jwt", {session: false}), getPost);
postRouter.delete("/:id", passport.authenticate("jwt", {session: false}), deletePost);


module.exports = postRouter;