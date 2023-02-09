const express = require('express');
const { userSessionCheck } = require('../middleware/route-guard');
const router = express.Router();
let loginCheck = false;

function checkLogin(session) {
  if (session !== undefined) {
    loginCheck = true;
  } else {
    loginCheck = false;
  }
}
/* GET home page */
router.get("/", (req, res, next) => {
  checkLogin(req.session.user)
  res.render("index", {session: loginCheck});

});

module.exports = router;
