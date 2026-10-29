const { createNewPost, getPostByID, updatePost, getAllPosts, deletePostByID} = require("../helpers/postQueries");


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

const getPost = async (req, res) => {
  const post = await getPostByID(req.params.id);
  if (!post) return res.status(404).json("post does not exist");
  res.status(200).json({post: post});
}

const getPosts = async (req, res) => {
  const posts = await getAllPosts();
  if (!posts) return res.status(404).json("Can't find any posts")
  res.status(200).json({posts: posts})
}

const deletePost = async (req, res) => {
  const post = await getPostByID(req.params.id);
  if (!post) return res.status(404).json("post does not exist");
  await deletePostByID(req.params.id);
  res.status(200).json("post deleted successfully")
}


module.exports = {
  createPost,
  editPost,
  getPost,
  getPosts,
  deletePost
}