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
