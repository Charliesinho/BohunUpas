const express = require('express');
const router = express.Router();
const session = require('express-session');
const { isLoggedIn } = require('../middleware/route-guard');
let loginCheck = false;

function checkLogin(session) {
  if (session !== undefined) {
    loginCheck = true;
  } else {
    loginCheck = false;
  }
}

/* GET home page */
router.get("/profile", isLoggedIn, (req, res, next) => {
  checkLogin(req.session.user);
  res.render("user/profile", {session: loginCheck});
});

module.exports = router;