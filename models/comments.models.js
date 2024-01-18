const db = require("../db/connection");

exports.fetchCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No user found for user_id: ${user_id}`,
        });
      }
      return rows;
    });
};

exports.insertCommentOnArticle = (newComment, article_id) => {
  const { author, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [author, body, article_id]
    )
    .then(({ rows }) => {
      if (rows === 0) {
        return Promise.reject({
          status: 400,
          msg: "Bad request",
        });
      }
      return rows;
    });
};
