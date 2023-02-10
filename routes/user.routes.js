const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
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
  const user = req.session.user;
  res.render("user/profile", {user: user, session: loginCheck});
});

router.get("/profile-update", isLoggedIn, (req, res, next) => {
  checkLogin(req.session.user);
  const user = req.session.user;
  res.render("user/profile-update", {user: user, errorMessage: "", session: loginCheck});
});

router.post("/profile-update", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const user = req.session.user;
  const updatedUser = {...req.body};

  // Check that PW matches repeat PW
  if (updatedUser.password !== updatedUser.Rpassword) {
    res.render("user/profile-update", {user: user, errorMessage: "The passwords need to match.", session: loginCheck});
    return;
  }

  const usernameInDb = await User.find({username: updatedUser.username});
  // If username was updated, check that it's not yet taken
  if (updatedUser.username !== user.username && usernameInDb.length) {
      res.render("user/profile-update", {user: user, errorMessage: "This username is already taken, please choose another one.", session: loginCheck});
      return;
  }
  // If email was updated, check that it's not yet taken
  const userEmailInDb = await User.find({email: updatedUser.username});
  if (updatedUser.email !== user.email && userEmailInDb.length) {
      res.render("user/profile-update", {user: user, errorMessage: "This email is already registered.", session: loginCheck});
      return;
  }

  // Check that current PW matches DB
  // Find User and Userhash to Update
  const getUser = await User.findOne({username: user.username});
  const getUserHash = getUser.passwordHash;
  if (await bcrypt.compare(updatedUser.Cpassword, getUserHash)) {
    // Update Password
    const salt = bcrypt.genSaltSync(13);
    const passwordHash = bcrypt.hashSync(updatedUser.password, salt);
    
    updatedUser.passwordHash = passwordHash;
    
    delete user.password;
    delete req.body.password;
    delete updatedUser.Cpassword;
    delete updatedUser.password;
    delete updatedUser.Rpassword;

    try {
      // Update
      await User.findOneAndUpdate({username: req.session.user.username}, {
        username: updatedUser.username,
        email: updatedUser.email,
        passwordHash: updatedUser.passwordHash,
      });

      req.session.user = {
        username: updatedUser.username,
        email: updatedUser.email,
      };

      res.render("user/profile", {user: updatedUser, errorMessage: "", session: loginCheck});
    } catch (error) {
      res.render("user/profile-update", {user: user, errorMessage: "An error occurred, please try again later.", session: loginCheck});
      return;
    }
  } else {
    res.render("user/profile-update", {user: user, errorMessage: "Your current password is incorrect, please try again.", session: loginCheck});
    return;
  }
});

router.get("/game", isLoggedIn, (req, res, next) => {
  checkLogin(req.session.user);
  res.render("user/game", {session: loginCheck});
});

router.get("/createcharacter", isLoggedIn, (req, res, next) => {
  checkLogin(req.session.user);
  res.render("user/createcharacter", {errorMessage: "", session: loginCheck});
});

router.post("/createcharacter", isLoggedIn, async (req, res) => {  
  try {
    const character = await Character.create(req.body)
    const user = await User.findOneAndUpdate({username: req.session.user.username}, {character: character._id}).populate('character')
    console.log(user)
    res.redirect("/user/characterProfile")
  } catch (error) {
    console.log("Error creating the Character, please try again: ", error);
    res.render("user/createcharacter", {errorMessage: "Error creating the Character, please try again", session: loginCheck})
  }
});

router.get("/characterProfile", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const profile = await User.findOne({username: req.session.user.username}).populate('character');
  console.log(profile)
  res.render("user/characterProfile", {errorMessage: "", profile: profile, session: loginCheck});
});

module.exports = router;