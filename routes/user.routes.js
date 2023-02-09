const express = require('express');
const router = express.Router();
const session = require('express-session');
const { isLoggedIn } = require('../middleware/route-guard');
const User = require('../models/User.model');
const Character = require('../models/Character.model');
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

router.get("/createcharacter", isLoggedIn, (req, res, next) => {
  checkLogin(req.session.user);
  res.render("user/createcharacter", {errorMessage: "", session: loginCheck});
});

router.post("/createcharacter", isLoggedIn, async (req, res) => {  
 const character = await Character.create(req.body)
//  const user = await User.findOne({username: req.session.user.username})
 const user = await User.findOneAndUpdate({username: req.session.user.username}, {character: character._id}).populate('character')
 console.log(user)
 res.redirect("/user/characterProfile")
});

router.get("/characterProfile", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const profile = await User.findOne({username: req.session.user.username}).populate('character');
  console.log(profile)
  res.render("user/characterProfile", {errorMessage: "", profile: profile, session: loginCheck});
});

module.exports = router;