const { prisma } = require("../../lib/prisma")

const createNewComment = async (postID, body, userID) => {
  await prisma.comment.create({
    data: {
      postId: parseInt(postID),
      body,
      authorId: parseInt(userID)
    }
  })
}

const getCommentByID = async (commentID) => {
  const comment = await prisma.comment.findUnique({
    where: {id: parseInt(commentID)}
  })
  return comment
}

const updateComment = async (commentID, body) => {
  await prisma.comment.update({
    where: {id: parseInt(commentID)},
    data: {
      body,
    }
  })
}

const removeCommentByID = async (commentID) => {
  await prisma.comment.delete({
    where: {id: parseInt(commentID)}
  })
}

module.exports = {
  createNewComment,
  getCommentByID,
  updateComment,
  removeCommentByID
}