const { fetchTopics, fetchArticle, fetchAllArticles, fetchArticleComments, checkArticleExists, insertComment, updateArticle, deleteComment, fetchUsers } = require('../model/nc-news-models')
const endPoints = require('../endpoints.json')

function sendEndpoints(req, res, next) {
    return res.status(200).send(endPoints)
}

function sendTopics(req, res, next) {
    return fetchTopics().then((topics) =>{
        res.status(200).send({ topics })
    }).catch(next)
}

function sendArticle(req , res, next) {
    const { article_id } = req.params
    return fetchArticle(article_id).then((article) =>{
        res.status(200).send( { article } )
    }).catch(next)
}

function sendAllArticles(req, res, next) {
    return fetchAllArticles().then((articles) =>{
        res.status(200).send( { articles } )
    }).catch(next)
}

function sendArticleComments(req, res, next) {
    const { article_id } = req.params
    Promise.all([fetchArticleComments(article_id), checkArticleExists(article_id)])
    .then((arr) => {
        res.status(200).send( { comments: arr[0] }  )
    }).catch(next)

}

function postCommentById(req, res, next) {
    const { article_id } = req.params
    const { body } = req

    insertComment(article_id, body)
    .then((comment) => {
        res.status(201).send({ comment })
    }).catch(next)
}

function patchArticle(req, res, next) {
    const { article_id } = req.params
    const { inc_votes } = req.body
    
    updateArticle(inc_votes, article_id)
    .then((article) => {
        res.status(200).send({ article })
    }).catch(next)
}

function sendDelete(req, res, next) {
    const { comment_id } = req.params

    deleteComment(comment_id)
    .then(() => {
        res.status(204).send()
    }).catch(next)
}

function sendUsers(req, res, next) {
    fetchUsers()
    .then((users) => {
        res.status(200).send({ users })
    }).catch(next)
}

module.exports = { sendTopics, sendEndpoints, sendArticle, sendAllArticles, sendArticleComments, postCommentById, patchArticle, sendDelete, sendUsers}