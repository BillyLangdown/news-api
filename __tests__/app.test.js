const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const endpointsData = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("404", () => {
  test("should return 404 if not given a valid endpoint", () => {
    return request(app).get("/api/wrong").expect(404);
  });
});

describe("get/api/topics", () => {
  test("should respond with an array of topics and a 200 status code", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBe(3);
        expect(topics[0].hasOwnProperty("slug")).toBe(true);
        expect(topics[0].hasOwnProperty("description")).toBe(true);
      });
  });
});

describe("get/api", () => {
  test("should return an the correct JSON file and a 200 status code.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ _body }) => {
        expect(_body).toEqual(endpointsData);
      });
  });
});

describe("get/api/articles/:id", () => {
  test("should return correct article when given an id and 200 status code", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0].article_id).toBe(1);
        expect(article[0].hasOwnProperty("title"));
        expect(article[0].hasOwnProperty("topic"));
        expect(article[0].hasOwnProperty("author"));
        expect(article[0].hasOwnProperty("body"));
        expect(article[0].hasOwnProperty("created_at"));
        expect(article[0].hasOwnProperty("votes"));
        expect(article[0].hasOwnProperty("article_img_url"));
        expect(article[0].hasOwnProperty("comment_count"));
      });
  });
  test("should sends an appropriate status and error message when given an invalid id and return a 400 status code.", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("get/api/articles", () => {
  test("should return an array of object containing article data and a 200 status code.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(
          articles.forEach((article) => {
            article.hasOwnProperty("article_id"),
              article.hasOwnProperty("title"),
              article.hasOwnProperty("topic"),
              article.hasOwnProperty("author"),
              article.hasOwnProperty("body"),
              article.hasOwnProperty("created_at"),
              article.hasOwnProperty("votes"),
              article.hasOwnProperty("article_img_url"),
              article.hasOwnProperty("comment_count");
          })
        );
      });
  });
});

describe("get/api/articles/:article_id/comments", () => {
  test("should respond with an array of comments for given article id and a 200 status code.", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(
          comments.forEach((comment) => {
            comment.hasOwnProperty("comment_id"),
              comment.hasOwnProperty("votes"),
              comment.hasOwnProperty("created_at"),
              comment.hasOwnProperty("author"),
              comment.hasOwnProperty("body"),
              comment.hasOwnProperty("article_id");
          })
        );
      });
  });
  test("should respond with bad request if non-number id is given and a 400 status code.", () => {
    return request(app)
      .get("/api/articles/:banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("post/api/articles/:article_id/comments", () => {
  test("should post a comment object to corresponding article using id and respond with that object and return a 201 status code", () => {
    const newComment = {
      body: "This is the new comment on article 9",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        comment.forEach((com) => {
          expect(com).hasOwnProperty("body");
          expect(com).hasOwnProperty("author");
          expect(com).hasOwnProperty("article_id");
        });
      });
  });
  test("should respond with correct msg for un-found id and 404 status code", () => {
    const newComment = {
      body: "This is the new comment on article 9",
      author: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("should respond with correct msg for un-found author and a 404 status code.", () => {
    const newComment = {
      body: "This is the new comment on article 9",
      author: "Not a Username",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("should respond with correct msg for post with no body and a 400 status code.", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("patch/api/articles/:article_id", () => {
  test("should update article and respond with updated article incremented by 1 and return a 200 status code.", () => {
    const newVote = { inc_votes: -50 };

    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0]).hasOwnProperty("article_img_url");
        expect(article[0]).hasOwnProperty("author");
        expect(article[0]).hasOwnProperty("body");
        expect(article[0]).hasOwnProperty("created_at");
        expect(article[0]).hasOwnProperty("title");
        expect(article[0]).hasOwnProperty("topic");
        expect(article[0].votes).toBe(50);
      });
  });
  test("should respond with correct msg for un-found id and return a 404 status code", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/999")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("should respond with correct msg if no body is given and return a 400 status code.", () => {
    return request(app)
      .patch("/api/articles/9")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("delete/api/comments/:comment_id", () => {
  test("should give no response, delete comment with given id and return a 204 status code.", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("should give correct msg if id is un-found and return a 404 status code", () => {
    return request(app).delete("/api/comments/999").expect(404);
  });
  test("should give correct msg if id is invalid and return a 400 status code.", () => {
    return request(app).delete("/api/comments/donkey").expect(400);
  });
});

describe("get/api/users", () => {
  test("should return all users and a 200 status code", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toMatchObject([
          {
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          },
          {
            username: "icellusedkars",
            name: "sam",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          },
          {
            username: "rogersop",
            name: "paul",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          },
          {
            username: "lurker",
            name: "do_nothing",
            avatar_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          },
        ]);
      });
  });
  test("should return not found when given a route that does not exist and return a 404 status code", () => {
    return request(app).get("/api/this-is-not-a-route").expect(404);
  });
});

describe("get/api/articles(topic query)", () => {
  test("should respond with articles with topic of cats and a 200 status code.", () => {
    return request(app)
      .get("/api/articles")
      .query({ topic: "cats" })
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(
          articles.forEach((article) => {
            article.hasOwnProperty("article_id");
            article.hasOwnProperty("title");
            article.hasOwnProperty("author");
            article.hasOwnProperty("body");
            article.hasOwnProperty("created_at");
            article.hasOwnProperty("votes");
            article.hasOwnProperty("article_img_url");
            article.hasOwnProperty("topic", "cats");
          })
        );
      });
  });
});

describe("get/api/articles/:article_id(comment_count)", () => {
  test("should respond with an article with corresponding article_id as well as a comment_count and  200 status code.", () => {
    return request(app)
      .get("/api/articles/9")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        article[0].hasOwnProperty("article_id");
        article[0].hasOwnProperty("title");
        article[0].hasOwnProperty("author");
        article[0].hasOwnProperty("body");
        article[0].hasOwnProperty("created_at");
        article[0].hasOwnProperty("votes");
        article[0].hasOwnProperty("article_img_url");
        expect(article[0].comment_count).toBe("2");
      });
  });
});

describe("post/api/articles", () => {
  test("should successfully post a new article and respond with that article with auto added properties as well as a 201 status code.", () => {
    const newArticle = {
      title: "This is a test article",
      topic: "mitch",
      author: "butter_bridge",
      body: "This is a post article test for the body of the article.",
      article_img_url:
        "https://plus.unsplash.com/premium_photo-1709311451457-21d7fb4638c2?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const { newArticle } = body;
        expect(newArticle[0].title).toBe("This is a test article");
        expect(newArticle[0].topic).toBe("mitch");
        expect(newArticle[0].author).toBe("butter_bridge");
        expect(newArticle[0].body).toBe(
          "This is a post article test for the body of the article."
        );
        expect(newArticle[0].votes).toBe(0);

        expect(newArticle[0]).toMatchObject({
          article_img_url:
            "https://plus.unsplash.com/premium_photo-1709311451457-21d7fb4638c2?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          created_at: expect.stringMatching(/^\d{4}-\d{2}-\d{2}/),
        });

        expect(newArticle[0]).toHaveProperty("article_id");
        expect(newArticle[0].article_id).toBeGreaterThan(0);
      });
  });
  test("should respond with bad request if inadequate  body is sent to post and a 400 status code.", () => {
    const newArticle = { title: "only a title" };

    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
