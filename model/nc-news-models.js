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
    return db.query('SELECT * FROM articles WHERE article_id=$1', [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject(
                ({status: 404, msg: 'Not Found'})
            )
        }
        return rows[0]
    })
}

function fetchAllArticles() {
    const articleQuery = db.query(`SELECT * FROM articles ORDER BY created_at DESC`)
    const commentQuery = db.query(`SELECT * FROM comments`)
    return Promise.all([articleQuery, commentQuery])
    .then(( arr ) => {
        const articles = arr[0].rows
        const comments = arr[1].rows

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
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
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

module.exports = { fetchTopics, fetchArticle, fetchAllArticles, fetchArticleComments, checkArticleExists, insertComment }