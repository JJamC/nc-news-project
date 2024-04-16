const { fetchTopics, fetchArticle, fetchAllArticles } = require('../model/nc-news-models')
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


module.exports = { sendTopics, sendEndpoints, sendArticle, sendAllArticles }