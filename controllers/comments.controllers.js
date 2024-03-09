const { response } = require("../app");
const {
  fetchCommentsByArticleId,
  insertCommentOnArticle,
  removeCommentById,
} = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(Number(article_id))) {
    res.status(400).send({ msg: "Bad request" });
  }
  fetchCommentsByArticleId(article_id)
    .then((response) => {
      res.status(200).send({ comments: response });
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
      res.status(201).send({ comment: response });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  if (isNaN(Number(comment_id))) {
    res.status(400).send({ msg: "Bad request" });
  }
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
