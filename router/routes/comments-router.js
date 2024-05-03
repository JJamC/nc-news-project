const commentsRouter = require("express").Router();
const { sendDelete, patchComment } = require("../../controller/nc-news-controller");

commentsRouter.route("/:comment_id").delete(sendDelete);
commentsRouter.route("/:comment_id").patch(patchComment);

module.exports = commentsRouter;
