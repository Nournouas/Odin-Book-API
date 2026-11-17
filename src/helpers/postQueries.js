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
      author: {
        select: {name: true, id: true}
      },
      comments: true,
      likes: {
        select: {
          id: true,
          liker: {
            select: {
              name: true,
              id: true
            }
          },
        },
      },
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
      author: {
        select: {name: true, id: true}
      },
      comments: {
        select: {
          id: true,
          body: true,
          createdAt: true,
          author: {
            select: {
              name: true,
              id: true
            }
          },
        },
      },
      likes: {
        select: {
          id: true,
          liker: {
            select: {
              name: true,
              id: true
            }
          },
        },
      },
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