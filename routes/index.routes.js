const express = require('express');
const { sessionCheck } = require('../middleware/route-guard');
const router = express.Router();
const User = require('../models/User.model');

let loginCheck = false;

function checkLogin(session) {
  if (session !== undefined) {
    loginCheck = true;
  } else {
    loginCheck = false;
  }
}


/* GET home page */
router.get("/", async (req, res, next) => {
  checkLogin(req.session.user);
  if (loginCheck) {
  const sessionName= req.session.user.username;
  const sessionRace = await User.find({username: sessionName})
  res.render("index", {session: loginCheck, sessionRace: sessionRace[0].character});
} else {
  res.render("index", {session: loginCheck, sessionRace: ""});
}
 
});

module.exports = router;
