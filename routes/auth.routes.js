const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');

/* GET home page */
router.get("/accountcheck", async (req, res, next) => {
    res.render("auth/signup-login", {errorMessage: ""});
  });

  router.post("/accountcheck", async (req, res) => {
    const user = req.body.username;
    const userCheck = await User.find({username: user})
    console.log("usercheck", userCheck)
    console.log("user", user)
    if (userCheck.length === 0) {
        res.render("auth/signup", {errorMessage: "", email: "", username: req.body.username});
    } else {
        res.render("auth/login", {errorMessage: "", email: "", username: req.body.username});
    }
  })

// router.get("/signup", (req, res, next) => {
//   res.render("auth/signup", {errorMessage: "", email: ""});
// });

router.post("/signup", async (req, res) => {
    const body = {...req.body};

// Secure email check
    // const regex = /(?=.\d)(?=.[a-z])(?=.*[A-Z]).{6,}/;
    // if (!regex.test(body.password)) {
    //     res.render("auth/signup", {email: body.email, errorMessage: "The password needs to have at least 6 chars and contain at least one number, one lowercase and one uppercase letter."});
    //     return;
    //} 

    if (body.password !== body.Rpassword) {
        res.render("auth/signup", {email: body.email, errorMessage: "The passwords don't match"});  
        console.log("im here")
        return;
    }

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
    res.redirect("/user/profile")
})

// router.get("/login", (req, res, next) => {
//   res.render("auth/login", {errorMessage: ""});
// });

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

router.get("/logout", (req, res, next) => {
  session.destroy(error => {
    if (error) next (error);
    res.redirect("/");
  })
});

module.exports = router;