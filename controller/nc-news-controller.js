const { fetchTopics } = require('../model/nc-news-models')

function sendTopics(req, res, next) {
    return fetchTopics().then((topics) =>{
        res.status(200).send({ topics })
    }).catch(next)
}

module.exports = { sendTopics }