const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const Character = require('../models/Character.model');
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

function getUserWithoutHash(user) {
    let userId, charId
    userId = JSON.stringify(user)
    userId = userId.split(":")[1].split(",")[0].replace(`"`, "").replace(`"`, "");
    charId = JSON.stringify(user.character[0]);
    charId = charId.split(":")[1].split(",")[0].replace(`"`, "").replace(`"`, "");
    return {
        id: userId,
        charId: charId,
        username: user.username,
        email: user.email,
        character: user.character,
        friends: user.friends,
        _id: charId
    }
}

// MAIN PAGE
router.get("/friends", isLoggedIn, async (req, res, next) => {
    checkLogin(req.session.user);
    const sessionName = req.session.user.username;
    const user = await User.find({username: sessionName}).populate("character").populate("friends");
    const currentUser = getUserWithoutHash(user[0]);
    const character = await Character.findById(currentUser.charId).populate("inventory");

    console.log(currentUser);

    res.render("friends", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, errorMessage: ""});
});

// FIND
router.post("/friends/find", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const sessionName = req.session.user.username;
  const user = await User.find({username: sessionName}).populate("character").populate("friends");
  const currentUser = getUserWithoutHash(user[0]);
  const character = await Character.findById(currentUser.charId).populate("inventory");

  const searchTerm = await User.findOne({username: searchTerm}) 

  res.render("friends", {session: loginCheck, sessionRace: [currentUser], currentUser: currentUser, character: character, errorMessage: ""});
});

module.exports = router;
