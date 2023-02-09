const express = require('express');
const User = require('../models/User.model');
const router = express.Router();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { isLoggedOut, isLoggedIn } = require('../middleware/route-guard');
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
    res.render("auth/signup-login", {errorMessage: "", session: loginCheck});
  });

  router.post("/accountcheck", isLoggedOut, async (req, res) => {
    checkLogin(req.session.user);
    const user = req.body.username;
    const userCheck = await User.find({username: user})
    console.log("usercheck", userCheck)
    console.log("user", user)
    if (userCheck.length === 0) {
        res.render("auth/signup", {errorMessage: "", email: "", username: req.body.username, session: loginCheck});
    } else {
        res.render("auth/login", {errorMessage: "", email: "", username: req.body.username, session: loginCheck});
    }
  })

// router.get("/signup", (req, res, next) => {
//   res.render("auth/signup", {errorMessage: "", email: ""});
// });

router.post("/signup", isLoggedOut, async (req, res) => {
    checkLogin(req.session.user);
    const body = {...req.body};

// Secure email check
    // const regex = /(?=.\d)(?=.[a-z])(?=.*[A-Z]).{6,}/;
    // if (!regex.test(body.password)) {
    //     res.render("auth/signup", {email: body.email, errorMessage: "The password needs to have at least 6 chars and contain at least one number, one lowercase and one uppercase letter."});
    //     return;
    //} 

    if (body.password !== body.Rpassword) {
        res.render("auth/signup", {username: req.body.username, email: body.email, errorMessage: "The passwords don't match", session: loginCheck});  
        console.log("im here")
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(body.password, salt);   

    
    delete body.password;

    body.passwordHash = passwordHash;

    try  {
      await User.create(body);
      res.redirect("/user/profile")
    }
    catch (error) {
     console.log(error);
    }
})

// router.get("/login", (req, res, next) => {
//   res.render("auth/login", {errorMessage: ""});
// });

router.post("/login", isLoggedOut, async (req, res, next) => {
  checkLogin(req.session.user);
  const user = req.body
  if (!user.username || !user.password) {
    res.render("auth/login", {username: user.username, errorMessage: "Please provide a Username and a Password.", session: loginCheck});
    return;
  }

  try {
    const username = user.username;
    const loginUser = await User.findOne({username});
    if (!loginUser) {
      res.render("auth/login", {username: user.username, errorMessage: "This username does not exist.", session: loginCheck});
      return;
    } else if (bcrypt.compareSync(user.password, loginUser.passwordHash)) {
      delete user.password;
      
      req.session.user = {
        username: loginUser.username,
        email: loginUser.email,
      };
      
      res.redirect("/user/profile");
    } else {
      res.render("auth/login", {username: user.username, errorMessage: "The password is incorrect.", session: loginCheck});
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