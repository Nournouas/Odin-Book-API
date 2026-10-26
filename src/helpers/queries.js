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
    where: {id}
  })
  return existingUser;
}

const updateUserById = async(id, name, bio) => {
  await prisma.user.update({
    where: {
      id
    },
    data: {
      name,
      bio
    }
  })
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByID,
  updateUserById
}