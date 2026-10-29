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
      .send({bio: "new bio", name})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);
  });

  it ("returns 401 when unauthorised or wrong user", async () => {
    const res = await request(app)
      .put(`/user/${id}`)
      .send({bio: "new bio", name})
    expect(res.status).toBe(401);

    const res2 = await request(app)
      .put(`/user/1`)
      .send({bio: "new bio", name})
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(401);
  })

  it ("edits the user", async () => {
    const res = await request(app)
      .put(`/user/${id}`)
      .send({bio: "new bio", name})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);

    const user = await findUserByEmail(email);
    expect(user.bio).toBe("new bio");
  })

  it ("doesnt edit email", async () => {
    const res = await request(app)
      .put(`/user/${id}`)
      .send({email: "newemail@gmail.com"})
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(401);
  })

})


describe("GET /user" , () => {
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
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);
  });

  it ("returns 401 when unauthorised", async () => {
    const res = await request(app)
      .get(`/user/${id}`)
    expect(res.status).toBe(401);
  })

  it ("returns a user object", async () => {
    const res = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined()
    expect(res.body.user).toHaveProperty("id")
    expect(res.body.user).toHaveProperty("name")
    expect(res.body.user).toHaveProperty("bio")
    expect(res.body.user).toHaveProperty("posts")
    expect(res.body.user).toHaveProperty("comments")
    expect(res.body.user).toHaveProperty("followed")
    expect(res.body.user).toHaveProperty("following")
    expect(res.body.user).not.toHaveProperty("password")
    expect(res.body.user).not.toHaveProperty("email")
  })

  it ("fails when a user doesnt exist or wrong id", async () => {
    const res = await request(app)
      .get(`/user/thisuserdoesnotexist`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(500);

    const res2 = await request(app)
      .get(`/user/3241294`)
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(404);
  })

})


describe("GET /user/all" , () => {
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  const password2 = "1234567892";
  const email2 = "test2@gmail.com"
  const name2 =  "test2-user"
  let id;
  let token;
  //creates a use in the db before each
  beforeEach(async () => {
    const hashed = await bcrypt.hash(password, 10);
    const hashed2 = await bcrypt.hash(password2, 10);
    const user = await createUser(email, name, hashed);
    await createUser(email2, name2, hashed2);
    id = user.id;
    const res1 = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    token = res1.body.token
  }) 

  it ("returns a 201 when authorised", async () => {
    const res = await request(app)
      .get("/user/all")
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);
  });

  it ("returns 401 when unauthorised", async () => {
    const res = await request(app)
      .get(`/user/all`)
    expect(res.status).toBe(401);
  })

  it ("returns an array of user objects", async () => {
    const res = await request(app)
      .get(`/user/all`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);
    expect(res.body.users[0]).toBeDefined()
    expect(res.body.users[0]).toHaveProperty("id")
    expect(res.body.users[0]).toHaveProperty("name")
    expect(res.body.users[0]).toHaveProperty("bio")
    expect(res.body.users[0]).toHaveProperty("posts")
    expect(res.body.users[0]).toHaveProperty("comments")
    expect(res.body.users[0]).toHaveProperty("followed")
    expect(res.body.users[0]).toHaveProperty("following")
    expect(res.body.users[0]).not.toHaveProperty("password")
    expect(res.body.users[0]).not.toHaveProperty("email")
    expect(res.body.users[1]).toBeDefined()
    expect(res.body.users[1]).toHaveProperty("id")
    expect(res.body.users[1]).toHaveProperty("name")
    expect(res.body.users[1]).toHaveProperty("bio")
    expect(res.body.users[1]).toHaveProperty("posts")
    expect(res.body.users[1]).toHaveProperty("comments")
    expect(res.body.users[1]).toHaveProperty("followed")
    expect(res.body.users[1]).toHaveProperty("following")
    expect(res.body.users[1]).not.toHaveProperty("password")
    expect(res.body.users[1]).not.toHaveProperty("email")
  })
})



describe("DEL /user/:id" , () => {
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  const password2 = "1234567892";
  const email2 = "test2@gmail.com"
  const name2 =  "test2-user"
  let id;
  let token;
  let token2;
  //creates a use in the db before each
  beforeEach(async () => {
    const hashed = await bcrypt.hash(password, 10);
    const hashed2 = await bcrypt.hash(password2, 10);
    const user = await createUser(email, name, hashed);
    await createUser(email2, name2, hashed2);
    id = user.id;
    const res1 = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    token = res1.body.token
    const res2 = await request(app)
      .post("/auth/login")
      .send({email: "test2@gmail.com", password: "1234567892", name: "test2"});
    token2 = res2.body.token
  }) 

  it ("returns a 200 when authorised", async () => {
    const res = await request(app)
      .del(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200);
  });

  it ("returns a 401 when unauthorised", async () => {
    const res = await request(app)
      .del(`/user/1`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(401);

    const res2 = await request(app)
      .del(`/user/${id}`)
    expect(res2.status).toBe(401);
  });
  
  it ("deletes selected user", async () => {
    const res = await request(app)
      .del(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(200)

    const res2 = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token2}`)
    expect(res2.status).toBe(404)
    expect(res2.body.user).toBeUndefined()
  });

})

describe("PUT /user/:id/follow" , () => {
  const password = "123456789";
  const email = "test@gmail.com"
  const name =  "test-user"
  const password2 = "1234567892";
  const email2 = "test2@gmail.com"
  const name2 =  "test2-user"
  let id;
  let id2;
  let token;
  let token2;
  //creates a use in the db before each
  beforeEach(async () => {
    const hashed = await bcrypt.hash(password, 10);
    const hashed2 = await bcrypt.hash(password2, 10);
    const user = await createUser(email, name, hashed);
    const user2 = await createUser(email2, name2, hashed2);
    id = user.id;
    id2 = user2.id
    const res1 = await request(app)
      .post("/auth/login")
      .send({email: "test@gmail.com", password: "123456789", name: "test"});
    token = res1.body.token
    const res2 = await request(app)
      .post("/auth/login")
      .send({email: "test2@gmail.com", password: "1234567892", name: "test2"});
    token2 = res2.body.token
  }) 

  it ("returns a 201 when authorised", async () => {
    const res = await request(app)
      .put(`/user/${id2}/follow`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);
  });

  it ("returns a 401 when unauthorised", async () => {
    const res = await request(app)
      .put(`/user/${id}/follow`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(400);

    const res2 = await request(app)
      .put(`/user/${id2}/follow`)
    expect(res2.status).toBe(401);
  });

  it ("follows a user", async () => {
    const res = await request(app)
      .put(`/user/${id2}/follow`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);

    const res2 = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(201);
    expect(res2.body.user.following).toHaveLength(1)
    
  });

  it ("cannot double follow a user", async () => {
    const res = await request(app)
      .put(`/user/${id2}/follow`)
      .set("Authorization", `Bearer ${token}`)
    expect(res.status).toBe(201);

    const res2 = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(201);
    expect(res2.body.user.following).toHaveLength(1)

    const res3 = await request(app)
      .put(`/user/${id2}/follow`)
      .set("Authorization", `Bearer ${token}`)
    expect(res3.status).toBe(400);

    const res4 = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    console.log(res4.body.user.following)
    expect(res4.status).toBe(201);
    expect(res4.body.user.following).toHaveLength(1)
    
  });
  
})

describe.only("POSTS - GET /user/:id"  , () => {
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

  it ("gets a posts object", async () => {
    const res2 = await request(app)
      .put(`/user/${id2}/follow`)
      .set("Authorization", `Bearer ${token}`)
    expect(res2.status).toBe(201);

    const res = await request(app)
      .get(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`)
    console.log(res.body.user);
    expect(res.status).toBe(200);
  });

})