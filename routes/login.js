const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    const { username, password } = req.query;

    conn.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({
            error,
            user: null,
          });
        }
        console.log(result);
        if (result.length === 0) {
          return res.status(401).send({
            message: "Usuário ou senha inválidos",
          });
        }

        res.status(200).send({
          user: result[0],
        });
      }
    );
  });
});

module.exports = router;
