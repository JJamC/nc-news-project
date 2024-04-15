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

module.exports = { fetchTopics, fetchArticle }