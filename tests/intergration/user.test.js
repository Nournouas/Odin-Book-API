const request = require("supertest");
const app = require("../../src/app");
const { prisma } = require("../../lib/prisma");
const { createUser, findUserByEmail } = require("../../src/helpers/queries");
const bcrypt = require("bcryptjs");

describe("PUT /user" , () => {
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  let id;
  let token;
  //creates a use in the db before each
  beforeEach(async () => {
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(email, name, hashed);
    id = user.id;
    const res1 = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    token = res1.body.token
  }) 

  it ("returns a 201 when authorised", async () => {
    const res = await request(app)
      .put(`/user/${id}`)
      .send({bio: "new bio"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);
  });

  it ("returns 401 when unauthorised or wrong user", async () => {
    const res = await request(app)
      .put(`/user/${id}`)
      .send({bio: "new bio"})
    expect(res.status).toBe(401);

    const res2 = await request(app)
      .put(`/user/1`)
      .send({bio: "new bio"})
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(401);
  })

  it ("edits the user", async () => {
    const res = await request(app)
      .put(`/user/${id}`)
      .send({bio: "new bio"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);

    const user = await findUserByEmail(email);
    expect(user.bio).toBe("new bio");
  })

})