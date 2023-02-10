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
router.get("/profile", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const profile = await User.findOne({username: req.session.user.username}).populate('character');

  const sessionName= req.session.user.username;
  const sessionRace = await User.find({username: sessionName})

  res.render("user/profile", {session: loginCheck, profile: profile, sessionRace: sessionRace[0].character, session: loginCheck});
});

router.get("/createcharacter", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const profile = await User.findOne({username: req.session.user.username})

  const sessionName= req.session.user.username;
  const sessionRace = await User.find({username: sessionName})

  if (profile.character.length) {
    res.redirect("/user/characterProfile")
  } else {
    res.render("user/createcharacter", {errorMessage: "", sessionRace: sessionRace[0].character, session: loginCheck});
  }
});

router.post("/createcharacter", isLoggedIn, async (req, res) => {  
 const character = await Character.create(req.body)
//  const user = await User.findOne({username: req.session.user.username})
 const user = await User.findOneAndUpdate({username: req.session.user.username}, {character: character._id}).populate('character')
 res.redirect("/user/characterProfile")
});

router.get("/characterProfile", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const profile = await User.findOne({username: req.session.user.username}).populate('character');

  const sessionName= req.session.user.username;
  const sessionRace = await User.find({username: sessionName})

  if (!profile.character.length) {
    res.redirect("/user/createcharacter")
  } else {
    res.render("user/characterProfile", {errorMessage: "", profile: profile, sessionRace: sessionRace[0].character, session: loginCheck});
  }
});

module.exports = router;