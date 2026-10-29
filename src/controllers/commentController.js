const { createNewComment, getCommentByID, updateComment, removeCommentByID } = require("../helpers/commentQueries");
const { getPostByID } = require("../helpers/postQueries");

const createComment = async (req, res) => {
  if (!req.body.body) return res.status(400).json("missing body")
  const { postID , body } = req.body;
  const post = await getPostByID(postID);
  if (!post) return res.status(404).json("post does not exist");
  await createNewComment(postID, body, req.user.id);
  res.status(201).json("comment created")
}

const editComment = async (req, res) => {
  const comment = await getCommentByID(req.params.id);
  if (!comment) return res.status(404).json("comment does not exist");
  if (comment.authorId != req.user.id) return res.status(401).json("Unauthorised to edit this comment");
  await updateComment(req.params.id, req.body.body)
  res.status(200).json("comment edited successfully")
}

const deleteComment = async (req, res) => {
  const comment = await getCommentByID(req.params.id);
  if (!comment) return res.status(404).json("comment does not exist");
  if (comment.authorId != req.user.id) return res.status(401).json("Unauthorised to delete this comment");
  await removeCommentByID(req.params.id)
  res.status(200).json("comment deleted successfully")
}

module.exports = {
  createComment,
  editComment,
  deleteComment
}