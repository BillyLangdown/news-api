const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getApi } = require("./controllers/api.controllers");
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postCommentOnArticle,
  deleteCommentById,
} = require("./controllers/comments.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentOnArticle);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.thrown) {
    res.status(err.thrown.status).send({ msg: err.thrown.msg });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else if (err.code === "23502" || err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;
