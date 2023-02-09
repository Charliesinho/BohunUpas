const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { isLoggedIn } = require('../middleware/route-guard');
const { update } = require('../models/User.model');
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

  if (updatedUser.password !== updatedUser.Rpassword) {
    res.render("user/profile-update", {errorMessage: "The passwords need to match.", session: loginCheck});
    return;
  }

  const getUser = await User.findOne({username: user.username})
  const getUserHash = getUser.passwordHash;

  if (bcrypt.compare(updatedUser.Cpassword, getUserHash)) {
    // Update Password
    const salt = bcrypt.genSaltSync(13);
    const passwordHash = bcrypt.hashSync(updatedUser.password, salt);
    console.log("CPASSWORD: ", updatedUser.Cpassword, "HASH: ", passwordHash);
    
    delete user.password;
    delete req.body.password;
    updatedUser.passwordHash = passwordHash;

    
    delete updatedUser.Cpassword;
    delete updatedUser.password;
    delete updatedUser.Rpassword;
    
    console.log("getUser: ", getUser, "updatedUser: ", updatedUser)
    try {
      //await User.updateOne({getUser}, {...updatedUser});
      await User.findOneAndUpdate({username: req.session.user.username}, {
        username: updatedUser.username,
        email: updatedUser.email,
        passwordHash: updatedUser.passwordHash,
      });
      res.render("user/profile", {user: updatedUser, errorMessage: "", session: loginCheck});
    } catch (error) {
      res.render("user/profile-update", {errorMessage: "Your current password is incorrect, please try again.", session: loginCheck});
      return;
    }
  } else {
    res.render("user/profile-update", {errorMessage: "Your current password is incorrect, please try again.", session: loginCheck});
    return;
  }
});

router.get("/game", isLoggedIn, (req, res, next) => {
  checkLogin(req.session.user);
  res.render("user/game", {session: loginCheck});
});

module.exports = router;