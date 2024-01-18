const { response } = require("../app");
const {
  fetchCommentsByArticleId,
  insertCommentOnArticle,
  removeCommentById,
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

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  console.log(comment_id);
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};