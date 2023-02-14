/* GET home page */
const express = require('express');
const router = express.Router();
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
        character: user.character
    }
}

router.get("/marketplace", isLoggedIn, async (req, res, next) => {
    checkLogin(req.session.user);
    const sessionName = req.session.user.username;
    const user = await User.find({username: sessionName}).populate("character");
    const currentUser = getUserWithoutHash(user[0]);
    const character = await Character.findById(currentUser.charId).populate("inventory").populate("weapon").populate("artefact").populate("armor");
    res.render("marketplace", {session: loginCheck, sessionRace: [currentUser], character: character, errorMessage: ""})
});

router.get("/marketplace/createOffer/", isLoggedIn, async (req, res, next) => {
    checkLogin(req.session.user);
    const sessionName = req.session.user.username;
    const user = await User.find({username: sessionName}).populate("character");
    const currentUser = getUserWithoutHash(user[0]);
    const character = await Character.findById(currentUser.charId).populate("inventory").populate("weapon").populate("artefact").populate("armor");
    res.render("marketplace/create-offer", {session: loginCheck, sessionRace: [currentUser], character: character, errorMessage: ""})
})

//router.post("/marketplace/createOffer/")

module.exports = router;