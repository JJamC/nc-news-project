const topicsRouter = require("express").Router();
const { sendTopics } = require("../../controller/nc-news-controller");

topicsRouter.route("/").get(sendTopics);

module.exports = topicsRouter;
