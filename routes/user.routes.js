const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { isLoggedIn } = require('../middleware/route-guard');
const User = require('../models/User.model');
const Character = require('../models/Character.model');
const { findOneAndUpdate, findByIdAndUpdate } = require('../models/User.model');
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

router.get("/profile-update", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);

  const sessionName= req.session.user.username;
  const sessionRace = await User.find({username: sessionName})

  const user = req.session.user;
  res.render("user/profile-update", {user: user, errorMessage: "", sessionRace: sessionRace[0].character, session: loginCheck});
});

router.post("/profile-update", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);

  const sessionName= req.session.user.username;
  const sessionRace = await User.find({username: sessionName})

  const user = req.session.user;
  const updatedUser = {...req.body};

  // Check that PW matches repeat PW
  if (updatedUser.password !== updatedUser.Rpassword) {
    res.render("user/profile-update", {user: user, errorMessage: "The passwords need to match.", sessionRace: sessionRace[0].character, session: loginCheck});
    return;
  }

  const usernameInDb = await User.find({username: updatedUser.username});
  // If username was updated, check that it's not yet taken
  if (updatedUser.username !== user.username && usernameInDb.length) {
      res.render("user/profile-update", {user: user, errorMessage: "This username is already taken, please choose another one.", sessionRace: sessionRace[0].character, session: loginCheck});
      return;
  }
  // If email was updated, check that it's not yet taken
  const userEmailInDb = await User.find({email: updatedUser.username});
  if (updatedUser.email !== user.email && userEmailInDb.length) {
      res.render("user/profile-update", {user: user, errorMessage: "This email is already registered.", sessionRace: sessionRace[0].character, session: loginCheck});
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
      res.redirect("/user/profile");
    } catch (error) {
      console.log("error1")
      res.render("user/profile-update", {user: user, errorMessage: "An error occurred, please try again later.", sessionRace: sessionRace[0], session: loginCheck});
      return;
    }
  } else {
    console.log("error2")
    res.render("user/profile-update", {user: user, errorMessage: "Your current password is incorrect, please try again.", sessionRace: sessionRace[0], session: loginCheck});
    return;
  }
});

router.get("/game", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user); 

  const sessionName= req.session.user.username;
  const sessionRace2 = await User.find({username: sessionName}).populate('character')
  const sessionRace = await User.find({username: sessionName})
  

  res.render("user/game", {sessionRace2: sessionRace2[0], sessionRace: sessionRace, session: loginCheck});
});

router.post("/:id/game", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  let souls = parseInt(req.body.souls);
  await Character.findByIdAndUpdate(req.params.id, {souls: souls})
  res.redirect("/user/characterProfile");
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

  const sessionName= req.session.user.username;
  const sessionRace = await User.find({username: sessionName})

  try {
    const character = await Character.create(req.body)
    const user = await User.findOneAndUpdate({username: req.session.user.username}, {character: character._id}).populate('character')    
    res.redirect("/user/characterProfile")
  } catch (error) {
    console.log("Error creating the Character, please try again: ", error);
    res.render("user/createcharacter", {errorMessage: "Error creating the Character, please try again", sessionRace: sessionRace[0].character, session: loginCheck})
  }
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


router.get("/soulkeeper/:charId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);

  const sessionRace = await User.findOne({username: req.session.user.username}).populate("character");
  const character = await Character.findById(req.params.charId);
  console.log(character);
  console.log("CHARACTER: ",character, "SOULS: ", character.souls);
  
  res.render("user/soulkeeper", {character: character, errorMessage: "", sessionRace: sessionRace.character, session: loginCheck});
});

router.post("/soulkeeper/spend/:id", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const sessionRace = await User.find({username: req.session.user.username}).populate("character");
  
  const character = req.params;
  const characterProfile = await Character.findById(character.id)
  const currentSouls = parseInt(characterProfile.souls);
  const spentSouls = parseInt(req.body.spentSouls);

  console.log(currentSouls)

  await Character.findByIdAndUpdate(character.id, {souls: currentSouls - spentSouls})

  if (spentSouls === 0) {
    res.redirect("/user/soulkeeper");
  } else {
    res.render("user/soulkeeper", {character: character, errorMessage: "", sessionRace: sessionRace[0].character, session: loginCheck})
  }
})



module.exports = router;