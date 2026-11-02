const { Prisma } = require("@prisma/client/extension");
const { prisma } = require("../../lib/prisma")

// AUTH ROUTE
const createUser = async (email, name, password) => {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password
    }
  })
  return user;
}

const findUserByEmail = async (email) => {
  const existingUser = await prisma.user.findUnique({
    where: {email},
  })
  return existingUser;
}

const findUserByID = async (id) => {
  const existingUser = await prisma.user.findUnique({
    where: {id: parseInt(id)}
  })
  return existingUser;
}

// USER ROUTE
const updateUserById = async(id, name, bio) => {
  await prisma.user.update({
    where: {
      id: parseInt(id)
    },
    data: {
      name,
      bio
    }
  })
}

const findUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {id: parseInt(id)},
    omit: {
      password: true,
      email: true,
    },
    include: {
      posts: true,
      comments: true,
    }
  })

  return user;
}

const findUsers = async() => {
  const users = await prisma.user.findMany({
    omit:{
      password: true,
      email: true,
    },
    include: {
      posts: true,
      comments: true,
      followed: true,
      following: true,
    }
  })
  return users;
}

const deleteUser = async (id) => {
  await prisma.user.delete({
    where: {id: parseInt(id)}
  })
}

const userFollow = async (userID, otherID) => {
  await prisma.user.update({
    where: {id: parseInt(userID)},
    data: {
      following: {
        create: {
          followedId: parseInt(otherID),
        }
      }
    }
  })
}

const userUnfollow = async (userID, otherID) => {
  await prisma.follows.delete({
    where: {
      followingId_followedId: {
        followingId: parseInt(userID),
        followedId: parseInt(otherID),
      },
    },
  });
}

const existingFollow = async (userID, otherID) => {
  const existing = await prisma.follows.findUnique({
    where: {
      followingId_followedId: {
        followedId: parseInt(otherID),
        followingId: parseInt(userID)
      }
    }
  })
  return existing;
}

const findFollowers = async (id) => {
  const followers = await prisma.user.findMany({
    where: {following: {some: {followedId: parseInt(id)}}},
    select: {id: true, name: true, bio: true}
  })
  return followers;
}

const findFollowing = async (id) => {
  const following = await prisma.user.findMany({
    where: {followed: {some: {followingId: parseInt(id)}}},
    select: {id: true, name: true, bio: true, posts: true}
  })
  return following;
}


module.exports = {
  createUser,
  findUserByEmail,
  findUserByID,
  updateUserById,
  findUser,
  findUsers,
  deleteUser,
  userFollow,
  existingFollow,
  findFollowers,
  userUnfollow,
  findFollowing
}