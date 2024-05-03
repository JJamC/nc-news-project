const commentsRouter = require("express").Router();
const { sendDelete } = require("../../controller/nc-news-controller");

commentsRouter.route("/:comment_id").delete(sendDelete);

module.exports = commentsRouter;
