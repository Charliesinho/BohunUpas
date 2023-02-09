const express = require('express');
const router = express.Router();
const UserModel = require("../models/User.model")
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
     await UserModel.create(body);
    }
    catch (error) {
     console.log(error);
    }
    res.redirect("/auth/signup")
})

module.exports = router;

