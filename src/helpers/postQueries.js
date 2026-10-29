const { Prisma } = require("@prisma/client/extension");
const { prisma } = require("../../lib/prisma")


const createNewPost = async (title, body, userID) => {
  await prisma.post.create({
    data : {
      authorId: parseInt(userID),
      title,
      body,
    }
  })
}

const getPostByID = async (id) => {
  const post = await prisma.post.findUnique({
    where: {id: parseInt(id)},
    include: {
      author: true,
      comments: true,
    }
  })
  return post;
}

const updatePost = async (postID, title, body) => {
  await prisma.post.update({
    where: {id: parseInt(postID)},
    data: {
      title,
      body,
    }
  })
}

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: true,
    }
  })
  return posts;
}

const deletePostByID = async (postID) => {
  await prisma.post.delete({
    where: {id: parseInt(postID)}
  })
}

module.exports = {
  createNewPost,
  getPostByID,
  updatePost,
  getAllPosts,
  deletePostByID
}