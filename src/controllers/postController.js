const { createNewPost, getPostByID, updatePost} = require("../helpers/postQueries");


const createPost = async (req, res) => {
  const { title, body } = req.body;
  if (title && body) {
    await createNewPost(title, body, req.user.id)
  }
  res.status(201).json("post created")
}

const editPost = async (req, res) => {
  const {title, body} = req.body;
  const post = await getPostByID(req.params.id);
  if (!post) return res.status(404).json("post does not exist")
  if (title && body && post.authorId == req.user.id) {
    await updatePost(req.params.id, title, body);
    res.status(201).json("edited successfully")
  }else{
    res.status(401).json("unauthorised to edit this post")
  }
}

module.exports = {
  createPost,
  editPost
}