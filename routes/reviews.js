const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/article/:articleId", (req, res, next) => {
  const { articleId } = req.params;

  mysql.getConnection((error, conn) => {
    conn.query(
      "SELECT * FROM article_reviews WHERE article_id = ?",
      [articleId],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error,
          });
        }

        res.status(200).send({
          reviews: result,
        });
      }
    );
  });
});

router.get("/user", (req, res, next) => {
  const { articleId, username } = req.query;

  mysql.getConnection((error, conn) => {
    conn.query(
      "SELECT * FROM article_reviews WHERE username = ? AND article_id = ?",
      [username, articleId],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error,
          });
        }

        if (result.length === 0) {
          return res.status(401).send({
            message: "Nenhuma avaliação encontrada",
          });
        }

        res.status(200).send({
          review: result[0],
        });
      }
    );
  });
});

router.post("/", (req, res, next) => {
  const { articleId, username, comment, rate } = req.query;

  mysql.getConnection((error, conn) => {
    conn.query(
      "INSERT INTO article_reviews (article_id, username, comment, rate) VALUES (?,?,?,?)",
      [articleId, username, comment, rate],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error,
          });
        }

        if (result.length === 0) {
          return res.status(401).send({
            message: "Falha em cadastrar avaliação",
          });
        }

        res.status(200).send({
          review: result[0],
        });
      }
    );
  });
});

module.exports = router;
