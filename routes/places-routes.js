const express = require('express');

const router = express.Router();

router.get("/", (req, res) => {
  console.log("GET Request in Places");
  res.json({message: "GET Request in Places received"})
});

module.exports = router;