const request = require("supertest");
const app = require("../../src/app");
const { prisma } = require("../../lib/prisma");
const { createUser, findUserByEmail } = require("../../src/helpers/queries");
const bcrypt = require("bcryptjs");

describe("POST /comment" , () => {
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

  it ("it receives a 201 status when authorised", async () => {
    const res = await request(app)
      .post(`/comment`)
      .send({postID: postId, body: "comment"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);
  });

  it ("it receives a 401 status when unauthorised", async () => {
    const res = await request(app)
      .post(`/comment`)
      .send({postID: postId, body: "comment"})
    expect(res.status).toBe(401);
  });

  it ("it creates a comment", async () => {
    const res = await request(app)
      .post(`/comment`)
      .send({postID: postId, body: "comment"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);

    const res2 = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(200)
    expect(res2.body.post).toBeDefined();
    expect(res2.body.post.comments).toHaveLength(1);
    expect(res2.body.post.comments[0]).toBeDefined();
    expect(res2.body.post.comments[0]).toHaveProperty("id");
    expect(res2.body.post.comments[0]).toHaveProperty("body");
    expect(res2.body.post.comments[0]).toHaveProperty("createdAt");
    expect(res2.body.post.comments[0]).toHaveProperty("authorId");
    expect(res2.body.post.comments[0]).toHaveProperty("postId");
    expect(res2.body.post.comments[0].body).toBe("comment")
    expect(res2.body.post.comments[0].authorId).toBe(id)
  });

  it ("throws a 404 when try to comment on a post that doesnt exist", async () => {
    const res = await request(app)
      .post(`/comment`)
      .send({postID: 493240234, body: "comment"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(404);
  });

  it ("throws a 400 when the body field is missing", async () => {
    const res = await request(app)
      .post(`/comment`)
      .send({postID: postId})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(400);
  });

})

describe("PUT /comment/:id" , () => {
  // details
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  const password2 = "123456789";
  const email2 = "test2@gmail.com"
  const name2 =  "test-user2"
  let id;
  let id2;
  let token;
  let token2;
  let postId;
  let postId2;
  let commentId;
  let commentId2;

  //creates a user and post in the db before each
  beforeEach(async () => {
    //creates users
    const hashed = await bcrypt.hash(password, 10);
    const hashed2 = await bcrypt.hash(password2, 10);
    const user = await createUser(email, name, hashed);
    const user2 = await createUser(email2, name2, hashed2);
    id = user.id;
    id2 = user2.id;
    const res1 = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    token = res1.body.token
    const res12 = await request(app)
      .post("/auth/login")
      .send({email: "test2@gmail.com", password: "123456789", name: "test-user2"});
    token2 = res12.body.token
    //creates a post
    await request(app)
      .post(`/post`)
      .send({title: "new post", body: "new post body"})
      .set("Authorization", `Bearer ${token}`)
    const res2 = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    postId = res2.body.user.posts[0].id

    await request(app)
      .post(`/post`)
      .send({title: "new post2", body: "new post body2"})
      .set("Authorization", `Bearer ${token2}`)
    const res22 = await request(app)
      .get(`/user/${id2}`)
      .set("Authorization", `Bearer ${token2}`)
    postId2 = res22.body.user.posts[0].id

    //creates a comment
    const res3 = await request(app)
      .post(`/comment`)
      .send({postID: postId, body: "comment"})
      .set("Authorization", `Bearer ${token}`)
    expect(res3.status).toBe(201);

    const res4 = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res4.status).toBe(200)

    commentId = res4.body.post.comments[0].id

    const res32 = await request(app)
      .post(`/comment`)
      .send({postID: postId2, body: "comment2"})
      .set("Authorization", `Bearer ${token2}`)
    expect(res32.status).toBe(201);

    const res42 = await request(app)
      .get(`/post/${postId2}`)
      .set("Authorization", `Bearer ${token2}`)
    expect(res42.status).toBe(200)

    commentId2 = res42.body.post.comments[0].id
  }) 

  // TESTS ---------------

  it ("it receives a 200 status when authorised", async () => {
    const res = await request(app)
      .put(`/comment/${commentId}`)
      .send({body: "comment"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
  });

  it ("it receives a 401 status when unauthorised", async () => {
    const res = await request(app)
      .put(`/comment/${commentId}`)
      .send({body: "comment"})
    expect(res.status).toBe(401);
  });

  it ("it receives a 404 status when the comment doesnt exist", async () => {
    const res = await request(app)
      .put(`/comment/20319209`)
      .send({body: "comment"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(404);
  });

  it ("it receives a 401 status when editing a comment that doesnt belong to user", async () => {
    const res = await request(app)
      .put(`/comment/${commentId}`)
      .send({body: "comment"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
    
    const res2 = await request(app)
      .put(`/comment/${commentId2}`)
      .send({body: "comment"})
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(401);
  });

  it ("edits the comment", async () => {
    const res4 = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res4.status).toBe(200)
    expect(res4.body.post.comments[0].body).toBe("comment")

    const res = await request(app)
      .put(`/comment/${commentId}`)
      .send({body: "new comment"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
    
    const res5 = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res5.status).toBe(200)
    expect(res5.body.post.comments[0].body).toBe("new comment")
  });
})

describe("DELETE /comment/:id" , () => {
  // details
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  const password2 = "123456789";
  const email2 = "test2@gmail.com"
  const name2 =  "test-user2"
  let id;
  let id2;
  let token;
  let token2;
  let postId;
  let postId2;
  let commentId;
  let commentId2;

  //creates a user and post in the db before each
  beforeEach(async () => {
    //creates users
    const hashed = await bcrypt.hash(password, 10);
    const hashed2 = await bcrypt.hash(password2, 10);
    const user = await createUser(email, name, hashed);
    const user2 = await createUser(email2, name2, hashed2);
    id = user.id;
    id2 = user2.id;
    const res1 = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    token = res1.body.token
    const res12 = await request(app)
      .post("/auth/login")
      .send({email: "test2@gmail.com", password: "123456789", name: "test-user2"});
    token2 = res12.body.token
    //creates a post
    await request(app)
      .post(`/post`)
      .send({title: "new post", body: "new post body"})
      .set("Authorization", `Bearer ${token}`)
    const res2 = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    postId = res2.body.user.posts[0].id

    await request(app)
      .post(`/post`)
      .send({title: "new post2", body: "new post body2"})
      .set("Authorization", `Bearer ${token2}`)
    const res22 = await request(app)
      .get(`/user/${id2}`)
      .set("Authorization", `Bearer ${token2}`)
    postId2 = res22.body.user.posts[0].id

    //creates a comment
    const res3 = await request(app)
      .post(`/comment`)
      .send({postID: postId, body: "comment"})
      .set("Authorization", `Bearer ${token}`)
    expect(res3.status).toBe(201);

    const res4 = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res4.status).toBe(200)

    commentId = res4.body.post.comments[0].id

    const res32 = await request(app)
      .post(`/comment`)
      .send({postID: postId2, body: "comment2"})
      .set("Authorization", `Bearer ${token2}`)
    expect(res32.status).toBe(201);

    const res42 = await request(app)
      .get(`/post/${postId2}`)
      .set("Authorization", `Bearer ${token2}`)
    expect(res42.status).toBe(200)

    commentId2 = res42.body.post.comments[0].id
  }) 

  // TESTS ---------------

  it ("it receives a 200 status when authorised", async () => {
    const res = await request(app)
      .delete(`/comment/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
  });

  it ("it receives a 401 status when unauthorised", async () => {
    const res = await request(app)
      .delete(`/comment/${commentId}`)
    expect(res.status).toBe(401);
  });

  it ("it receives a 404 status when the comment doesnt exist", async () => {
    const res = await request(app)
      .delete(`/comment/20319209`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(404);
  });

  it ("it receives a 401 status when deleting a comment that doesnt belong to user", async () => {
    const res = await request(app)
      .delete(`/comment/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
    
    const res2 = await request(app)
      .delete(`/comment/${commentId2}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(401);
  });

  it ("deletes the comment", async () => {
    const res4 = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res4.status).toBe(200)
    expect(res4.body.post.comments).toHaveLength(1)

    const res = await request(app)
      .delete(`/comment/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
    
    const res5 = await request(app)
      .get(`/post/${postId}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res5.status).toBe(200)
    expect(res5.body.post.comments).toHaveLength(0)
  });

})