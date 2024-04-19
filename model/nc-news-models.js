const db = require('../db/connection')

function fetchTopics() {
    return db.query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows
    })
}

function fetchArticle(article_id) {
    const idNumber = Number(article_id)
    if(Number.isNaN(idNumber)) {
        return Promise.reject(
            ({status: 400, msg: 'Bad Request'})
        )
    }
    return db.query(`SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count 
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id=$1
    GROUP BY 
    articles.article_id;`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject(
                ({status: 404, msg: 'Not Found'})
            )
        }
        return rows[0]
    })
}

function fetchAllArticles(topic) {
    
    let articleQuery = db.query(`SELECT * FROM articles ORDER BY created_at DESC`)
    const commentQuery = db.query(`SELECT * FROM comments`)

    if (topic) {
        articleQuery = db.query(`SELECT * FROM articles WHERE topic=$1 ORDER BY created_at DESC`, [topic])
    }
    return Promise.all([articleQuery, commentQuery])
    .then(( arr ) => {
        const articles = arr[0].rows
        const comments = arr[1].rows

        if(!articles.length) {
            return Promise.reject(
                ({status: 404, msg: 'Not Found'})
            )
        }

        articles.forEach((article) => {
            let commentCount = 0
            comments.forEach((comment => {
                if(article.article_id === comment.article_id) {
                    commentCount ++
                }
            }))
            article.comment_count = commentCount
            delete article.body
        })
        return articles
    })
}

function fetchArticleComments(article_id) {
    return db.query(`SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`, [article_id])
    .then(({ rows }) => {
        return rows
    })
}

function checkArticleExists(article_id) {
    const idNumber = Number(article_id)
    if(Number.isNaN(idNumber)) {
        return Promise.reject(
            ({status: 400, msg: 'Bad Request'})
        )}
    return db.query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject(
            ({status: 404, msg: 'Not Found'})
            )
        }
        return rows
    })
}

function insertComment(article_id, body) {
    return db.query(`INSERT INTO comments(article_id, author, body)
    VALUES ($1, $2, $3) 
    RETURNING *;`, [article_id, body.username, body.body ])
    .then(({ rows }) => {
        return rows[0]
    })
}

function updateArticle(voteUpdate, article_id) {  
    if(!voteUpdate) {
        return Promise.reject({status: 400, msg: 'Bad Request'})
    }
    return db.query(`UPDATE articles
    SET
      votes= votes + $1
    WHERE article_id=$2
    RETURNING *;`, [voteUpdate, article_id])
    .then(({ rows }) => {
        if(!rows.length) {
            return Promise.reject({status: 400, msg: 'Bad Request'})
        }
        return rows[0]
    })
}

function deleteComment(comment_id) {
    return db.query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *;`, [comment_id]).
    then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject
                ({status: 404, msg: 'Not Found'})
        }
        return rows
    })
}

function fetchUsers() {
    return db.query(`SELECT * FROM users`)
    .then(({ rows }) => {
        return rows
    })
}

module.exports = { 
    fetchTopics, 
    fetchArticle, 
    fetchAllArticles, 
    fetchArticleComments, 
    checkArticleExists, 
    insertComment, 
    updateArticle, 
    deleteComment, 
    fetchUsers, 
     }