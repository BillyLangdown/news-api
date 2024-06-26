const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT
        articles.*,
        COALESCE(COUNT(comments.article_id), 0) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
      [article_id]
    )
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
exports.fetchArticles = (query) => {
  let queryValues = [];
  let queryStr = `
    SELECT
      articles.*,
      COALESCE(COUNT(comments.article_id), 0) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (query) {
    queryValues.push(query);
    queryStr += ` WHERE articles.topic = $1 `;
  }

  queryStr += ` GROUP BY articles.article_id
               ORDER BY articles.created_at DESC;`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleById = (inc_votes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return rows;
    });
};

exports.insertNewArticle = (newArticle) => {
  const { title, topic, author, body, article_img_url } = newArticle;
  return db
    .query(
      `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) 
    VALUES ($1, $2, $3, $4, NOW(), $5, $6) RETURNING *;`,
      [title, topic, author, body, 0, article_img_url]
    )
    .then((data) => {
      return data.rows;
    })
    .catch((error) => {
      throw error;
    });
};

exports.removeArticleById = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
    });
};
