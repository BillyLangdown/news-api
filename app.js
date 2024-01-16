const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getApi } = require("./controllers/api.controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.thrown) {
    res.status(err.thrown.status).send({ msg: err.thrown.msg });
  } else if (err.code === "23502" || err.code === "22P02")
    res.status(400).send({ msg: "Bad request" });
  else {
    res.status(500).send({ msg: "Internal server error" });
  }
});

module.exports = app;
