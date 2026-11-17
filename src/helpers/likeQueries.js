const { prisma } = require("../../lib/prisma")

const createNewLike = async (postID, userID) => {
  await prisma.like.create({
    data: {
      postId: parseInt(postID),
      likerId: parseInt(userID)
    }
  })
}

const checkAlreadyLike = async (postID, userID) => {
  let likes = await prisma.like.findMany({
    where: {
      AND: [
        {likerId: parseInt(userID)}, {postId: parseInt(postID)}
      ] 
    }
  })
  return likes.length > 0 ?  true :  false;
}

const deleteLikeQuery = async (postID, userID) => {
  let like = await prisma.like.findMany({
    where: {
      AND: [
        {likerId: parseInt(userID)}, {postId: parseInt(postID)}
      ]
    }
  })
  await prisma.like.delete({
    where: {
      id: like[0].id
    }
  })
}



module.exports = {
  createNewLike,
  deleteLikeQuery,
  checkAlreadyLike
}