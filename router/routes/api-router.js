const express = require('express')
const app = express()
const apiRouter = express.Router()
const usersRouter = require('./users-router')
const articlesRouter = require('./articles-router')
const topicsRouter = require('./topics-router')
const commentsRouter = require('./comments-router')
const sendEndpoints = require('../../controller/nc-news-controller')

apiRouter.use('/users', usersRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/comments', commentsRouter)


module.exports = apiRouter;