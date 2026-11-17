const { createNewLike, deleteLikeQuery, checkAlreadyLike} = require("../helpers/likeQueries");
const { getPostByID } = require("../helpers/postQueries");

//make sure user cant like twice
const createLike = async (req, res) => {
  const { postID } = req.body;
  const post = await getPostByID(postID);
  if (!post) return res.status(404).json("post does not exist");
  let alreadyLiked = await checkAlreadyLike(postID, req.user.id);
  if (alreadyLiked) return res.status(400).json("already liked");
  await createNewLike(postID, req.user.id);
  res.status(201).json("like created")
}

//make sure user cant unlike twice
const deleteLike = async (req, res) => {
  const { postID } = req.body;
  const post = await getPostByID(postID);
  if (!post) return res.status(404).json("post does not exist");
  let alreadyLiked = await checkAlreadyLike(postID, req.user.id);
  if (!alreadyLiked) return res.status(400).json("dont like this");
  await deleteLikeQuery(postID, req.user.id)
  res.status(200).json("comment deleted successfully")
}

module.exports = {
  createLike,
  deleteLike
}