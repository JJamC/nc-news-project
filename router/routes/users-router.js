const usersRouter = require("express").Router();
const { sendUsers, sendUser } = require("../../controller/nc-news-controller");

usersRouter.route("/").get(sendUsers);

usersRouter.route("/:username").get(sendUser)

module.exports = usersRouter;
