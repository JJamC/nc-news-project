const { fetchTopics } = require('../model/nc-news-models')
const endPoints = require('../endpoints.json')

function sendEndpoints(req, res, next) {
    return res.status(200).send(endPoints)
}

function sendTopics(req, res, next) {
    return fetchTopics().then((topics) =>{
        res.status(200).send({ topics })
    }).catch(next)
}


module.exports = { sendTopics, sendEndpoints }