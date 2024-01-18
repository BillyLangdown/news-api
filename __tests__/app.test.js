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
  test("Should give a status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("An array of objects is returned", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(3);
        expect(body[0].hasOwnProperty("slug")).toBe(true);
        expect(body[0].hasOwnProperty("description")).toBe(true);
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
        expect(body[0].article_id).toBe(1);
        expect(body[0].hasOwnProperty);
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
        expect(
          body.forEach((article) => {
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
        expect(body[0]).toMatchObject({
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
        expect(
          body.forEach((comment) => {
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
        body.forEach((comment) => {
          expect(comment).hasOwnProperty("body");
          expect(comment).hasOwnProperty("author");
          expect(comment).hasOwnProperty("article_id");
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
        expect(body[0]).hasOwnProperty("article_img_url");
        expect(body[0]).hasOwnProperty("author");
        expect(body[0]).hasOwnProperty("body");
        expect(body[0]).hasOwnProperty("created_at");
        expect(body[0]).hasOwnProperty("title");
        expect(body[0]).hasOwnProperty("topic");
        expect(body[0].votes).toBe(50);
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
      .patch("/api/articles/999")
      .send()
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
