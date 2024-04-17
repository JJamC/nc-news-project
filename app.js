const express = require('express')
const app = express()
const { sendTopics, sendEndpoints, sendArticle, sendAllArticles, sendArticleComments, postCommentById } = require('./controller/nc-news-controller')

app.get("/api", sendEndpoints)

app.get("/api/topics", sendTopics)

app.get('/api/articles/:article_id', sendArticle)

app.get('/api/articles', sendAllArticles)

app.get('/api/articles/:article_id/comments', sendArticleComments)

app.use(express.json())

app.post('/api/articles/:article_id/comments', postCommentById)

app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'Not Found'})
})

app.use((err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "internal server error"})
})

module.exports = app;