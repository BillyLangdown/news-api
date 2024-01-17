const { fetchCommentsByArticleId } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
};
