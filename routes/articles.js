const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;

router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    const { userId } = req.query;

    conn.query("SELECT * FROM articles", [userId], (error, result, field) => {
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
        revenues: result[0],
      });
    });
  });
});

module.exports = router;
