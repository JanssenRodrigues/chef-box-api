const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const loginRoute = require("./routes/login");
const userPreferencesRoute = require("./routes/user-preferences");
const articlesRoute = require("./routes/articles");
const reviewsRoute = require("./routes/reviews");
const ordersRoute = require("./routes/orders");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }

  next();
});

app.use("/login", loginRoute);
app.use("/user-preferences", userPreferencesRoute);
app.use("/articles", articlesRoute);
app.use("/reviews", reviewsRoute);
app.use("/orders", ordersRoute);

app.use((req, res, next) => {
  const error = new Error("Rota não encontrada");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
