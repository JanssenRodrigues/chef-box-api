const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query("SELECT * FROM articles", [], (error, result, field) => {
      conn.release();

      if (error) {
        return res.status(500).send({
          error,
        });
      }

      if (result.length === 0) {
        return res.status(401).send({
          message: "Não existem receitas cadastradas",
        });
      }

      res.status(200).send({
        revenues: result,
      });
    });
  });
});

router.get("/:url", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    conn.query(
      "SELECT * FROM articles WHERE url = ?",
      [req.params.url],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error,
          });
        }

        if (result.length === 0) {
          return res.status(401).send({
            message: "Não existem receitas cadastradas",
          });
        }

        res.status(200).send({
          revenue: result[0],
        });
      }
    );
  });
});

router.post("/review", (req, res, next) => {
  const { articleId, username, comment, rate } = req.query;
  console.log(req.query);
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
          revenue: result[0],
        });
      }
    );
  });
});

router.get("/review/user", (req, res, next) => {
  const { articleId, username } = req.query;
  console.log(req.query);
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
            message: "Avaliação não cadastrada",
          });
        }

        res.status(200).send({
          revenue: result[0],
        });
      }
    );
  });
});

module.exports = router;
