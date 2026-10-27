const { Prisma } = require("@prisma/client/extension");
const { prisma } = require("../../lib/prisma")

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
    where: {email}
  })
  return existingUser;
}

const findUserByID = async (id) => {
  const existingUser = await prisma.user.findUnique({
    where: {id: parseInt(id)}
  })
  return existingUser;
}

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
      followedBy: true,
      following: true,
    }
  })
  return user;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByID,
  updateUserById,
  findUser
}