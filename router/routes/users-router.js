const usersRouter = require('express').Router();
const { sendUsers } = require('../../controller/nc-news-controller')

usersRouter.route('/').get(sendUsers)

module.exports = usersRouter