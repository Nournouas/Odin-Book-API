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

describe("PUT /post/:id" , () => {

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

describe("GET /post/:id" , () => {
  // details
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  let id;
  let token;
  let postId;
  let commentId;

  //creates a user and post in the db before each
  beforeEach(async () => {
    //creates users
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

  it ("it receives a 200 status when authorised", async () => {
    const res = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
  });

  it ("it receives a 401 status when unauthorised", async () => {
    const res = await request(app)
      .get(`/post/${postId}`)
    expect(res.status).toBe(401);
  });

  it ("returns a post object", async () => {
    const res = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body.post.title).toBe("new post")
    expect(res.body.post.body).toBe("new post body")
  });

  it ("returns a post object with the comments", async () => {
    const res = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body.post.title).toBe("new post")
    expect(res.body.post.body).toBe("new post body")
    expect(res.body.post).toHaveProperty("comments")
  });

  it ("returns a post object with the author", async () => {
    const res = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body.post.title).toBe("new post")
    expect(res.body.post.body).toBe("new post body")
    expect(res.body.post).toHaveProperty("author")
  });

  it ("returns a 404 status when the post doesnt exist", async () => {
    const res = await request(app)
      .get(`/post/321312`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(404);
  });

  it ("returns a 500 status when the postid is in an incorrect format", async () => {
    const res = await request(app)
      .get(`/post/thisisabadid`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(500);
  });

})

describe("GET /post/all" , () => {
  // details
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  let id;
  let token;
  let postId;
  let commentId;

  //creates a user and post in the db before each
  beforeEach(async () => {
    //creates users
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

  it ("it receives a 200 status when authorised", async () => {
    const res = await request(app)
      .get(`/post/all`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
  });

  it ("it receives a 401 status when unauthorised", async () => {
    const res = await request(app)
      .get(`/post/all`)
    expect(res.status).toBe(401);
  });

  it ("it receives all posts", async () => {
    const res = await request(app)
      .get(`/post/all`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
    expect(res.body.posts).toBeDefined()
    expect(res.body.posts[0]).toBeDefined()
    expect(res.body.posts[0]).toHaveProperty("id")
    expect(res.body.posts[0]).toHaveProperty("title")
    expect(res.body.posts[0]).toHaveProperty("body")
    expect(res.body.posts[0]).toHaveProperty("createdAt")
    expect(res.body.posts[0]).toHaveProperty("authorId")
    expect(res.body.posts[0]).toHaveProperty("author")
    expect(res.body.posts[0]).toHaveProperty("comments")
  });

})

describe("DELETE /post/:id" , () => {
  // details
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  let id;
  let token;
  let postId;
  let commentId;

  //creates a user and post in the db before each
  beforeEach(async () => {
    //creates users
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

  it ("it receives a 200 status when authorised", async () => {
    const res = await request(app)
      .delete(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
  });

  it ("it receives a 401 status when unauthorised", async () => {
    const res = await request(app)
      .delete(`/post/${postId}`)
    expect(res.status).toBe(401);
  });

  it ("it receives a 404 status when it cant find the post", async () => {
    const res = await request(app)
      .delete(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
  });

  it ("it deletes a post", async () => {
    const res1 = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res1.status).toBe(200);
    expect(res1.body.post.title).toBe("new post")
    expect(res1.body.post.body).toBe("new post body")

    const res2 = await request(app)
      .delete(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(200);

    const res3 = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res3.status).toBe(404);

  });

})