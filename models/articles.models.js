const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count 
      FROM articles
      JOIN comments ON articles.article_id = comments.article_id
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
  SELECT articles.*, COUNT(comments.article_id) AS comment_count
  FROM articles
  JOIN comments ON articles.article_id = comments.article_id
  `;

  if (query !== undefined) {
    queryValues.push(query);
    queryStr += `WHERE articles.topic = $1 `;
  }
  queryStr += `GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;
  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

//   if (query) {
//     return db
//       .query(
//         `SELECT articles.*, COUNT(comments.article_id) AS comment_count
//       FROM articles
//       JOIN comments ON articles.article_id = comments.article_id
//       WHERE topic = $1
//       GROUP BY articles.article_id
//       ORDER BY articles.created_at DESC;`,
//         [query]
//       )
//       .then(({ rows }) => {
//         return rows;
//       });
//   }
//   return db
//     .query(
//       `SELECT articles.*, COUNT(comments.article_id) AS comment_count
//       FROM articles
//       JOIN comments ON articles.article_id = comments.article_id
//       GROUP BY articles.article_id
//       ORDER BY articles.created_at DESC;`
//     )
//     .then(({ rows }) => {
//       return rows;
//     });

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
