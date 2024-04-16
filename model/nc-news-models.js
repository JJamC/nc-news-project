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
    const articleQuery = db.query(`SELECT * FROM articles`)
    const commentQuery = db.query(`SELECT * FROM comments`)
    return Promise.all([articleQuery, commentQuery])
    .then(( arr ) => {
        const articles = arr[0].rows
        const comments = arr[1].rows

        comments.forEach((comment) => {
            
        })
        console.log(comments);
    })
}

module.exports = { fetchTopics, fetchArticle, fetchAllArticles }