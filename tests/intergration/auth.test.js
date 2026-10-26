const request = require("supertest");
const app = require("../../src/app");
const { prisma } = require("../../lib/prisma");
const bcrypt = require("bcryptjs");
const { createUser } = require("../../src/helpers/queries");

describe("POST /auth/signup", () => {
  it("creates a user and returns 201", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res.status).toBe(201);
    expect(res.body).toBe("Account Created");
  })

  it("creates a user and saves it to the database", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res.status).toBe(201);

    const user = await prisma.user.findUnique({where: {email: "test@gmail.com"}})
    expect(user).not.toBeNull();
  })

  it("hashes the user's password", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res.status).toBe(201);

    const user = await prisma.user.findUnique({where: {email: "test@gmail.com"}})
    expect(user.password).not.toEqual("123456789");
    expect(await bcrypt.compare("123456789", user.password)).toBeTruthy();
  })

  it("doesnt allow two users to share the same email", async () => {
    const res1 = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res1.status).toBe(201);

    const res2 = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res2.status).toBe(409);
  })

  it("catches missing field error and returns 400", async () => {
    const res1 = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "123456789"});
    expect(res1.status).toBe(400);
  })

  it("only accepts valid emails", async () => {
    const res1 = await request(app)
      .post("/auth/signup")
      .send({email: "test", password: "123456789", name: "test"});
    expect(res1.status).toBe(400);

    const res2 = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res2.status).toBe(201);
  })

  it("does not accept short passwords", async () => {
    const res1 = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "12345", name: "test"});
    expect(res1.status).toBe(400);

    const res2 = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res2.status).toBe(201);
  })

  it("does not accept 2 letter names", async () => {
    const res1 = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "123456789", name: "te"});
    expect(res1.status).toBe(400);

    const res2 = await request(app)
      .post("/auth/signup")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res2.status).toBe(201);
  })
});


describe("POST /auth/login", () => {
  const password = "123456789";
  //creates a use in the db before each
  beforeEach(async () => {
    const hashed = await bcrypt.hash(password, 10);
    await createUser("test@gmail.com", "test", hashed);
  }) 

  it("returns a 200 status code", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res.status).toBe(200);
  })

  it("cannot login with an account that doesnt exist", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res.status).toBe(200);

    const res2 = await request(app)
      .post("/auth/login")
      .send({email: "test2@gmail.com", password: "123456789", name: "test"});
    expect(res2.status).toBe(401);
  })

  it("login needs correct password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res.status).toBe(200);
    
    const res2 = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "987654321", name: "test"});
    expect(res2.status).toBe(400);
  })

  it("login returns a token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token")
  })

  it("protected route works", async () => {
    const res1 = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    expect(res1.status).toBe(200);
    expect(res1.body).toHaveProperty("token")
    
    const res2 = await request(app)
      .get("/auth/protected")
      .set("Authorization", `Bearer ${res1.body.token}`)
    expect(res2.status).toBe(200);
    expect(res2.body).toHaveProperty("user")
  })

  
});