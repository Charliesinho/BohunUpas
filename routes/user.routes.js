const express = require('express');
const router = express.Router();
const session = require('express-session');
const { isLoggedIn } = require('../middleware/route-guard');

/* GET home page */
router.get("/profile", isLoggedIn, (req, res, next) => {
  res.render("user/profile");
});

module.exports = router;