const { response } = require("../app");
const {
  fetchCommentsByArticleId,
  insertCommentOnArticle,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
};

exports.postCommentOnArticle = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  if (Object.keys(newComment).length === 0) {
    res.status(400).send({ msg: "Bad request" });
  }
  insertCommentOnArticle(newComment, article_id)
    .then((response) => {
      res.status(201).send(response);
    })
    .catch(next);
};
