const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "Bad request",
        });
      }
      return rows;
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count
      FROM articles
      JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};
