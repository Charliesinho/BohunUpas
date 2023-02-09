const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const bcrypt = require('bcryptjs');

/* GET home page */
router.get("/signup", (req, res, next) => {
  res.render("auth/signup", {errorMessage: ""});
});

router.post("/signup", async (req, res) => {
    const body = {...req.body};

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(body.password, salt);

    delete body.password;

    body.passwordHash = passwordHash;

    try  {
     await User.create(body);
    }
    catch (error) {
     console.log(error);
    }
    res.redirect("/auth/signup")
})

router.get("/login", (req, res, next) => {
  res.render("auth/login", {errorMessage: ""});
});

router.post("/login", async (req, res, next) => {
  const user = req.body
  if (!user.username || !user.password) {
    res.render("auth/login", {user: user, errorMessage: "Please provide a Username and a Password."});
    return;
  }

  try {
    const username = user.username;
    const loginUser = await User.findOne({username});
    if (!loginUser) {
      res.render("auth/login", {user: user, errorMessage: "This username does not exist."});
      return;
    } else if (bcrypt.compareSync(user.password, loginUser.passwordHash)) {
      console.log("SESSION ========> ", req.session);
      delete user.password;
      
      req.session.user = {
        username: loginUser.username,
        email: loginUser.email,
      };

      console.log(req.session.user);
      res.redirect("/auth/signup");
    } else {
      res.render("auth/login", {user: user, errorMessage: "The password is incorrect."});
    }
  } catch (error) {
    console.log("Error logging in: ", error);
    next(error);
  }
});

module.exports = router;