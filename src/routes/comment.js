const express = require("express");
const commentRouter = express.Router();
const { validate, createCommentValidator } = require("../helpers/validation");
const passport = require("passport");
const { createComment, editComment, deleteComment } = require("../controllers/commentController");

commentRouter.post("/", passport.authenticate("jwt", {session: false}), createCommentValidator, validate, createComment);
commentRouter.put("/:id", passport.authenticate("jwt", {session: false}), createCommentValidator, validate, editComment);
commentRouter.delete("/:id", passport.authenticate("jwt", {session: false}), deleteComment);

module.exports = commentRouter;