const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function fetchArticle(article_id) {
  const idNumber = Number(article_id);
  if (Number.isNaN(idNumber)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id=$1
    GROUP BY 
    articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
}

function fetchAllArticles(topic, sort_by = "created_at", order = "DESC") {
  const queryVals = [];

  let sqlQuery = `SELECT
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT (comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id `;

  if (topic) {
    sqlQuery += `WHERE topic=$1 `;
    queryVals.push(topic);
  }
  sqlQuery += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

  return db.query(sqlQuery, queryVals).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return rows;
  });
}

function fetchArticleComments(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function checkArticleExists(article_id) {
  const idNumber = Number(article_id);
  if (Number.isNaN(idNumber)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows;
    });
}

function insertArticle(
  author,
  title,
  body,
  topic,
  article_img_url = `https://m.media-amazon.com/images/I/41+gelS+89L.jpg`
) {
  if (!author || !title || !body || !topic) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `INSERT INTO articles(author, title, body, topic, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.body,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    (SELECT COUNT(*)
    FROM comments
    WHERE comments.article_id = articles.article_id)::INT AS comment_count;`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function insertComment(article_id, body) {
  return db
    .query(
      `INSERT INTO comments(article_id, author, body)
    VALUES ($1, $2, $3) 
    RETURNING *;`,
      [article_id, body.username, body.body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function updateComment(voteUpdate, comment_id) {
  if (!voteUpdate) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `UPDATE comments
    SET
        votes= votes + $1
        WHERE comment_id=$2
        RETURNING *;`,
      [voteUpdate, comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
      return rows[0];
    });
}

function updateArticle(voteUpdate, article_id) {
  if (!voteUpdate) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return db
    .query(
      `UPDATE articles
    SET
      votes= votes + $1
    WHERE article_id=$2
    RETURNING *;`,
      [voteUpdate, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
      return rows[0];
    });
}

function deleteComment(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows;
    });
}

function fetchUsers() {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
}

function fetchUserByUsername(username) {
  return db
    .query(`SELECT * FROM users WHERE username=$1`, [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
}

module.exports = {
  fetchTopics,
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  checkArticleExists,
  insertComment,
  updateComment,
  updateArticle,
  deleteComment,
  fetchUsers,
  fetchUserByUsername,
  insertArticle,
};
