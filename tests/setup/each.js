const { prisma } = require("../../lib/prisma");

beforeEach(async () => {
  //wipe DB before each test
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
})