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
      console.log(error)
      res.render("user/profile-update", {user: user, errorMessage: "An error occurred, please try again later.", sessionRace: sessionRace[0], session: loginCheck});
      return;
    }
  } else {
    res.render("user/profile-update", {user: user, errorMessage: "Your current password is incorrect, please try again.", sessionRace: sessionRace[0], session: loginCheck});
    return;
  }
});

router.get("/game", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user); 

  const sessionName = req.session.user.username;
  const sessionRace2 = await User.find({username: sessionName}).populate('character');
  charId = JSON.stringify(sessionRace2[0].character);
  charId = charId.split(":")[1].split(",")[0].replace(`"`, "").replace(`"`, "");
  const character = await Character.findById(charId).populate("weapon").populate("armor").populate("artefact");
  console.log("CHARACTER: ", character);
  const sessionRace = await User.find({username: sessionName})
  
  res.render("user/game", {sessionRace2: sessionRace2[0], sessionRace: sessionRace, session: loginCheck, character: character});
});

router.post("/:id/game", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  let souls = parseInt(req.body.souls);
  let experience = parseInt(req.body.experience);
  await Character.findByIdAndUpdate(req.params.id, {souls: souls, experience: experience})
  res.redirect("/user/characterProfile");
});

router.get("/createcharacter", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);
  const profile = await User.findOne({username: req.session.user.username})

  const sessionName = req.session.user.username;
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
  const sessionName = req.session.user.username;
  const sessionRace = await User.find({username: sessionName});
  const character = await Character.findOne(profile.character[0]._id).populate("inventory").populate("weapon").populate("armor").populate("artefact")
  const rendering = "characterProfile";
  
  if (!profile.character.length) {
    res.redirect("/user/createcharacter");
  } else {
    res.render("user/characterProfile", {errorMessage: "", profile: profile, character: character, sessionRace: sessionRace[0].character, rendering: rendering, session: loginCheck});
  }
});


router.get("/soulkeeper/:charId", isLoggedIn, async (req, res, next) => {
  checkLogin(req.session.user);

  const sessionRace = await User.findOne({username: req.session.user.username}).populate("character");
  const character = await Character.findById(req.params.charId).populate("inventory");
  res.render("user/soulkeeper", {character: character, inventory: character.inventory, errorMessage: "", sessionRace: sessionRace.character, session: loginCheck});
});

module.exports = router;