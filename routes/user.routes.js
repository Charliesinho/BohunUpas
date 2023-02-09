const express = require('express');
const router = express.Router();
const session = require('express-session');

/* GET home page */
router.get("/profile", (req, res, next) => {
  res.render("user/profile");
});

module.exports = router;