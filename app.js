const express = require('express')
const app = express()
const {
    sendTopics, 
    sendEndpoints, 
    sendArticle, 
    sendAllArticles, 
    sendArticleComments, 
    postCommentById, 
    patchArticle, 
    sendDelete, 
    sendUsers } = require('./controller/nc-news-controller')

app.use(express.json())

app.get("/api", sendEndpoints)

app.get("/api/topics", sendTopics)

app.get('/api/articles', sendAllArticles)

app.get('/api/users', sendUsers)

app.get('/api/articles/:article_id', sendArticle)

app.patch('/api/articles/:article_id', patchArticle)

app.get('/api/articles/:article_id/comments', sendArticleComments)

app.post('/api/articles/:article_id/comments', postCommentById)

app.delete('/api/comments/:comment_id', sendDelete)

app.all('*', (req, res, next) => {
    res.status(404).send({ msg: 'Endpoint Not Found'})
})
app.use((err, req, res, next) => {

    if (err.code === '23503') {
        res.status(404).send({ msg: 'Not Found'})
    }
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request'})
    }
    next(err)
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