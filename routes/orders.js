const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    const { userId } = req.query;

    conn.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
      [userId],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error,
            message:
              "Usuário precisa estar logado para acessar os seus pedidos",
          });
        }

        if (result.length === 0) {
          return res.status(401).send({
            message: "Usuário não possui pedidos cadastrados",
          });
        }

        res.status(200).send({
          orders: result,
        });
      }
    );
  });
});

router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    const { data, userId } = req.query;

    conn.query(
      "INSERT INTO orders (content, user_id, created_at) values (?,?,?)",
      [data, userId, new Date()],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error,
            message: "Usuário precisa estar logado para realizar uma compra",
          });
        }

        if (result.length === 0) {
          return res.status(401).send({
            message: "Usuário não possui pedidos cadastrados",
          });
        }

        res.status(200).send({
          order: result,
        });
      }
    );
  });
});

module.exports = router;
