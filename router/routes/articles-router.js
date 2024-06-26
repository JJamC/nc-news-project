const articlesRouter = require("express").Router();
const commentsRouter = require("express").Router();
const {
  sendAllArticles,
  sendArticle,
  patchArticle,
  sendArticleComments,
  postCommentById,
  postArticle
} = require("../../controller/nc-news-controller");

articlesRouter.route("/").get(sendAllArticles).post(postArticle)
articlesRouter.route("/:article_id").get(sendArticle).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(sendArticleComments)
  .post(postCommentById);

module.exports = articlesRouter;
