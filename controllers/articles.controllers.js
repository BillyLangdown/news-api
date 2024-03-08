const { response } = require("../app");
const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
  insertNewArticle,
  removeArticleById,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  fetchArticles(topic)
    .then((response) => {
      res.status(200).send({ articles: response });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticleById(inc_votes, article_id)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;

  if (
    !newArticle.author ||
    !newArticle.title ||
    !newArticle.topic ||
    !newArticle.article_img_url ||
    !newArticle.body
  ) {
    res.status(400).send({ msg: "Bad request" });
  }

  insertNewArticle(newArticle)
    .then((response) => {
      res.status(201).send({ newArticle: response });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
