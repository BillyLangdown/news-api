const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200", () => {
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
  test("Should return 404 if not exactly /topics is given", () => {
    return request(app).get("/api/wrong").expect(404);
  });
});
