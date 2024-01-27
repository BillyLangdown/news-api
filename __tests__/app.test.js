const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");
const endpointsData = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("404", () => {
  test("Should return 404 if not given a valid endpoint", () => {
    return request(app).get("/api/wrong").expect(404);
  });
});

describe("get/api/topics", () => {
  test("GET:200 An array of objects is returned", () => {
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
  test("GET:200 Should return an the correct JSON file.", () => {
    return request(app)
      .get("/api")
      .then(({ _body }) => {
        expect(_body).toEqual(endpointsData);
      });
  });
});

describe("get/api/articles/:id", () => {
  test("GET:200 Should return correct article when given an id.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article[0].article_id).toBe(1);
        expect(article[0].hasOwnProperty);
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("get/api/articles", () => {
  test("GET:200 Should an array of object containing article data", () => {
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
        expect(articles[0]).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T14:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "2",
        });
      });
  });
});

describe("get/api/articles/:article_id/comments", () => {
  test("GET:200, Should respond with an array of comments for given article id.", () => {
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
  test("GET:400, Should respond with bad request if non-number id is given.", () => {
    return request(app)
      .get("/api/articles/:banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("post/api/articles/:article_id/comments", () => {
  test("POST: 201 should post a comment object to corresponding article using id and respond with that object", () => {
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
  test("POST:404 should respond with correct msg for un-found id", () => {
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
  test("POST:404 should respond with correct msg for un-found author", () => {
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
  test("POST:400 should respond with correct msg for post with no body", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("Patch/api/articles/:article_id", () => {
  test("PATCH:200 update article and respond with updated article incremented by 1", () => {
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
  test("POST:404 should respond with correct msg for un-found id", () => {
    const newVote = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/999")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("POST:400 should respond with correct msg if no body is given", () => {
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
  test("DELETE:204 should give no response and delete comment with given id ", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE:404 should give correct msg if id is un-found ", () => {
    return request(app).delete("/api/comments/999").expect(404);
  });
  test("DELETE:400 should give correct msg if id is invalid ", () => {
    return request(app).delete("/api/comments/donkey").expect(400);
  });
});

describe("get/api/users", () => {
  test("GET:200 should return all users", () => {
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
  test("GET:404 should return not found when given a route that does not exist ", () => {
    return request(app).get("/api/this-is-not-a-route").expect(404);
  });
});

describe("get/api/articles(topic query)", () => {
  test("GET:200 should respond with articles with topic of cats", () => {
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
  test("GET:200 should respond with an article with corresponding article_id as well as a comment_count", () => {
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
