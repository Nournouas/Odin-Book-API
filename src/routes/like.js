const express = require("express");
const likeRouter = express.Router();
const passport = require("passport");
const { createLike, deleteLike} = require("../controllers/likeController");

likeRouter.post("/", passport.authenticate("jwt", {session: false}), createLike);
likeRouter.delete("/", passport.authenticate("jwt", {session: false}), deleteLike);

module.exports = likeRouter;