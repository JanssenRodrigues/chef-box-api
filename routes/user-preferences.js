const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    const { userId } = req.query;

    conn.query(
      "SELECT * FROM preferences WHERE user_id = ?",
      [userId],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error,
          });
        }

        if (result.length === 0) {
          return res.status(401).send({
            message: "Usuário não possui preferências cadastradas",
          });
        }

        res.status(200).send({
          preferences: result[0],
        });
      }
    );
  });
});

router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    const { userId, preferences } = req.query;

    conn.query(
      "INSERT INTO preferences (user_id, content) values (?,?)",
      [userId, preferences],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error,
          });
        }

        if (result.length === 0) {
          return res.status(401).send({
            message: "Usuário não possui preferências cadastradas",
          });
        }

        res.status(200).send({
          preferences: JSON.parse(result[0]),
        });
      }
    );
  });
});

router.patch("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    const { userId, preferences } = req.query;

    conn.query(
      "UPDATE preferences SET content = ? WHERE user_id = ?",
      [preferences, userId],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error,
          });
        }

        if (result.length === 0) {
          return res.status(401).send({
            message: "Usuário não possui preferências cadastradas",
          });
        }

        res.status(200).send({
          message: "Preferências atualizadas com sucesso.",
        });
      }
    );
  });
});

module.exports = router;
