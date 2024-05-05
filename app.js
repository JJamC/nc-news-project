const express = require("express");
const app = express();
const cors = require('cors')
const apiRouter = require("./router/routes/api-router");
const {
  sendEndpoints,
} = require("./controller/nc-news-controller");

app.use(cors())

app.use(express.json());

app.use("/api", apiRouter);

app.get("/api", sendEndpoints);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
});
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  }
  if (err.code === "22P02" || err.code === "42703") {
    res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
