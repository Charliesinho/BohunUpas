const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { isLoggedOut, isLoggedIn } = require('../middleware/route-guard');
const mongoose = require("mongoose");
let loginCheck = false;

function checkLogin(session) {
  if (session !== undefined) {
    loginCheck = true;
  } else {
    loginCheck = false;
  }
}

/* GET home page */
router.get("/accountcheck", isLoggedOut, async (req, res, next) => {
    checkLogin(req.session.user);
    res.render("auth/signup-login", {errorMessage: "", sessionRace: "", session: loginCheck});
  });

  router.post("/accountcheck", isLoggedOut, async (req, res) => {
    checkLogin(req.session.user);
    const user = req.body.username;
    const userCheck = await User.find({username: user})
    if (userCheck.length === 0) {
        res.render("auth/signup", {errorMessage: "", email: "", username: req.body.username, sessionRace: "", session: loginCheck});
    } else {
        res.render("auth/login", {errorMessage: "", email: "", username: req.body.username, sessionRace: "",  session: loginCheck});
    }
  })

  
  router.post("/signup", isLoggedOut, async (req, res) => {
    checkLogin(req.session.user);
    const body = {...req.body};

    if (body.password !== body.Rpassword) {
        res.render("auth/signup", {username: req.body.username, email: body.email, errorMessage: "The passwords don't match", sessionRace: "", session: loginCheck});  
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(body.password, salt);

    delete body.password;

    body.passwordHash = passwordHash;

    try  {
      await User.create(body);

      req.session.user = {
        username: body.username,
        email: body.email,
      };
      
      res.redirect("/user/createCharacter");
    }
    catch (error) {
      console.log("Error creating user: ", error);
      if (error instanceof mongoose.Error.ValidationError) {
          res.status(500).render("auth/signup", {username: body.username, email: body.email, errorMessage: error.message, session: loginCheck});
      } else if (error.code === 11000) {
          res.status(500).render("auth/signup", {username: body.username, email: body.email, errorMessage: "Username and / or email already in use.", session: loginCheck});
      } else {
          next(error);
      }
    }
})

router.post("/login", isLoggedOut, async (req, res, next) => {
  checkLogin(req.session.user);
  const user = req.body
  if (!user.username || !user.password) {
    res.render("auth/login", {username: user.username, errorMessage: "Please provide a Username and a Password.", sessionRace: "", session: loginCheck});
    return;
  }

  try {
    const username = user.username;
    const loginUser = await User.findOne({username});
    if (!loginUser) {
      res.render("auth/login", {username: user.username, errorMessage: "This username does not exist.", sessionRace: "", session: loginCheck});
      return;
    } else if (bcrypt.compareSync(user.password, loginUser.passwordHash)) {
      delete user.password;
      
      req.session.user = {
        username: loginUser.username,
        email: loginUser.email,
      };
      
      res.redirect("/user/profile");
    } else {
      res.render("auth/login", {username: user.username, errorMessage: "The password is incorrect.", sessionRace: "", session: loginCheck});
    }
  } catch (error) {
    console.log("Error logging in: ", error);
    next(error);
  }
});

router.get("/logout", isLoggedIn, (req, res, next) => {
  checkLogin(req.session.user);
  req.session.destroy(error => {
    if (error) next (error);
    res.redirect("/");
  })
});

module.exports = router;

//Hello