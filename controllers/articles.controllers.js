const {
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
};
