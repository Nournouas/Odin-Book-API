const request = require("supertest");
const app = require("../../src/app");
const { prisma } = require("../../lib/prisma");
const { createUser, findUserByEmail } = require("../../src/helpers/queries");
const bcrypt = require("bcryptjs");

describe("POST /post" , () => {
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  let id;
  let token;
  let postId;
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
      .post(`/post`)
      .send({title: "new post", body: "new post body"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);
  });

  it ("returns a 401 when unauthorised", async () => {
    const res = await request(app)
      .post(`/post`)
      .send({title: "new post", body: "new post body"})
    expect(res.status).toBe(401);
  });

  it ("creates a post", async () => {
    const res = await request(app)
      .post(`/post`)
      .send({title: "new post", body: "new post body"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);

    const res2 = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(201);
    expect(res2.body.user.posts).toHaveLength(1)
    expect(res2.body.user.posts[0].title).toBe("new post")
    expect(res2.body.user.posts[0].body).toBe("new post body")
  });

})

describe.only("PUT /post/:id" , () => {

  // details
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  let id;
  let token;
  let postId;

  //creates a user and post in the db before each
  beforeEach(async () => {
    //creates a user
    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(email, name, hashed);
    id = user.id;
    const res1 = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    token = res1.body.token
    //creates a post
    await request(app)
      .post(`/post`)
      .send({title: "new post", body: "new post body"})
      .set("Authorization", `Bearer ${token}`)

    const res2 = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)

    postId = res2.body.user.posts[0].id

  }) 

  // TESTS ---------------

  it ("returns a 201 when authorised", async () => {
    const res = await request(app)
      .put(`/post/${postId}`)
      .send({title: "EDITED TITLE", body: "EDITED BODY"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);
  });

  it ("returns a 401 when unauthorised", async () => {
    const res = await request(app)
      .put(`/post/${postId}`)
      .send({title: "EDITED TITLE", body: "EDITED BODY"})
    expect(res.status).toBe(401);
  });

  it ("returns a 401 when trying to edit posts that dont exist", async () => {
    const res = await request(app)
      .put(`/post/32190312`)
      .send({title: "EDITED TITLE", body: "EDITED BODY"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(404);
  });

  it ("edits the post", async () => {
    const res = await request(app)
      .put(`/post/${postId}`)
      .send({title: "EDITED TITLE", body: "EDITED BODY"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);

    const res2 = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(201);
    expect(res2.body.user.posts).toHaveLength(1)
    expect(res2.body.user.posts[0].title).toBe("EDITED TITLE")
    expect(res2.body.user.posts[0].body).toBe("EDITED BODY")
  });

})